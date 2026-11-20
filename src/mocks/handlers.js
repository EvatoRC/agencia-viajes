import { http, graphql, HttpResponse, delay } from 'msw'
import { graphql as ejecutarGraphQL } from 'graphql'
import { destinos } from './data'
import { schema, resolvers } from './schema'

// Permite probar errores del servicio REST agregando ?simular=404, 500 o json a la URL
async function simularRest(request) {
  await delay(700) // retraso para que se note el indicador de carga
  const tipo = new URL(request.url).searchParams.get('simular')
  if (tipo === '404') {
    return HttpResponse.json({ mensaje: 'El recurso solicitado no fue encontrado' }, { status: 404 })
  }
  if (tipo === '500') {
    return HttpResponse.json({ mensaje: 'Error interno del servidor' }, { status: 500 })
  }
  if (tipo === 'json') {
    // responde 200, pero el cuerpo no es JSON válido (ej: un proxy devolvió una página HTML)
    return new HttpResponse('<html><body>Servicio en mantención</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return null
}

export const handlers = [
  // ---------- REST ----------

  // GET /api/destinos -> lista de destinos con país y actividades populares
  http.get('/api/destinos', async ({ request }) => {
    const simulada = await simularRest(request)
    if (simulada) return simulada
    return HttpResponse.json(destinos)
  }),

  // GET /api/destinos/:id -> un destino
  http.get('/api/destinos/:id', async ({ request, params }) => {
    const simulada = await simularRest(request)
    if (simulada) return simulada

    const destino = destinos.find((d) => d.id === params.id)
    if (!destino) {
      return HttpResponse.json({ mensaje: `El destino "${params.id}" no existe` }, { status: 404 })
    }
    return HttpResponse.json(destino)
  }),

  // ---------- GraphQL ----------

  // Todas las operaciones GraphQL (queries y mutations) llegan como POST a /graphql.
  // En vez de un handler por operación, se ejecutan contra el esquema de schema.js,
  // así la respuesta trae exactamente los campos pedidos en la consulta.
  graphql.operation(async ({ query, variables }) => {
    await delay(700)
    const resultado = await ejecutarGraphQL({
      schema,
      source: query,
      rootValue: resolvers,
      variableValues: variables,
    })
    return HttpResponse.json(resultado)
  }),
]
