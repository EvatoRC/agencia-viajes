# Rumbo Viajes — Agencia de viajes con React, REST y GraphQL

Actividad sumativa semana 5: **"Integrando nuestro frontend con backend"**.

Aplicación React para una agencia de viajes

- **Destinos** → API **REST** mock (país, región y actividades populares)
- **Vuelos y hoteles** → API **GraphQL** mock, consumida con **Apollo Client**
- **Navegación** → **React Router**
- **Backend mock** → **MSW (Mock Service Worker)**, que atiende REST y GraphQL al mismo tiempo


## Tecnologías

React 19 · Vite · React Router · Apollo Client 4 · GraphQL · MSW 2 · ESLint · gh-pages

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abrir http://localhost:5173. Al cargar, la consola del navegador muestra `[MSW] Mocking enabled.`

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Revisa el código con ESLint |
| `npm run deploy` | Genera el build y lo publica en la rama `gh-pages` |

## Estructura

```
src/
├── mocks/
│   ├── data.js          # Datos simulados: destinos, vuelos y hoteles
│   ├── schema.js        # Esquema GraphQL y resolvers
│   ├── handlers.js      # Handlers MSW: REST (/api/...) y GraphQL (/graphql)
│   └── browser.js       # Service worker de MSW
├── services/api.js      # Cliente REST: fetch, caché, timeout y errores
├── graphql/
│   ├── cliente.js       # ApolloClient + InMemoryCache
│   ├── consultas.js     # Queries y mutation (gql)
│   └── errores.js       # Traduce errores de Apollo a mensajes claros
├── context/             # Estado global del plan de viaje
├── hooks/               # useApi (REST), usePlanViaje, useTitulo
├── components/          # Componentes reutilizables (tarjetas, carga, errores, layout)
├── pages/               # Una vista por ruta
└── utils/formato.js     # Precios, fechas y cálculo del total
```

## API REST mock

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/destinos` | Lista de destinos: ciudad, país, región, descripción y actividades populares |
| GET | `/api/destinos/:id` | Un destino (`404` si no existe) |

Ambas aceptan `?simular=404`, `?simular=500` o `?simular=json` (responde 200 con un cuerpo que no es JSON) para probar errores. Por ejemplo, `/#/destinos?simular=json`.

## API GraphQL mock

Todas las operaciones van por `POST /graphql`. El mock ejecuta las consultas contra un esquema real (`src/mocks/schema.js`) con la librería `graphql`, así que valida la consulta y responde **solo los campos pedidos**, como un servidor de verdad.

```graphql
type Query {
  disponibilidad(destinoId: ID!): Disponibilidad!   # vuelos + hoteles + consultadoEn
  vuelos(destinoId: ID!): [Vuelo!]!
  hoteles(destinoId: ID!): [Hotel!]!
  vuelo(id: ID!): Vuelo
  hotel(id: ID!): Hotel
}

type Mutation {
  crearReserva(vueloId: ID, hotelId: ID, noches: Int!, pasajeros: Int!): Reserva!
}
```

| Operación | Dónde se usa | Qué pide |
|---|---|---|
| `OpcionesDestino` | Detalle de destino | Vuelos **y** hoteles del destino en **una sola petición**, solo con los campos de las tarjetas, más `consultadoEn` (hora en que el servidor entregó los datos) |
| `DetalleVuelo` | `/vuelos/:id` | Campos extra: clase, equipaje, origen, destino |
| `DetalleHotel` | `/hoteles/:id` | Campos extra: descripción, servicios, fechas con disponibilidad |
| `CrearReserva` | Mi viaje | Reserva y descuenta asientos y habitaciones |

Después de reservar, la mutation devuelve el vuelo y el hotel con su nueva disponibilidad. Apollo actualiza su caché por `id` y las listas muestran los cupos descontados **sin hacer otra consulta**.

## Rutas (React Router)

| Ruta | Vista | Fuente de datos |
|---|---|---|
| `/` | Inicio con destinos destacados | REST |
| `/destinos` | Todos los destinos, con buscador y filtro por región | REST |
| `/destinos/:idDestino` | Destino + sus vuelos y hoteles | REST + GraphQL |
| `/vuelos/:idVuelo` | Detalle de un vuelo | GraphQL |
| `/hoteles/:idHotel` | Detalle de un hotel | GraphQL |
| `/mi-viaje` | Resumen del plan, total y reserva | GraphQL (mutation) |
| `*` | Página no encontrada | — |

Se usa `HashRouter` (las URLs llevan `#`) porque GitHub Pages no sabe redirigir rutas de una SPA: con `BrowserRouter`, recargar en `/destinos/cusco` daría 404.

## Vigencia de los datos y comportamiento ante fallos

La caché REST vive en un almacén fuera de React (`services/api.js`). Las vistas lo leen con `useSyncExternalStore`, así que cada cambio (empieza una petición, llega una respuesta o un error) vuelve a renderizar la vista. Cada estado es un objeto nuevo, nunca se modifica el anterior.

En GraphQL, la hora de los datos viene **dentro de la respuesta** (`consultadoEn`), así que el render no depende de nada externo (`hooks/useConsultaVigente.js`).

### Política

| Regla | REST (destinos) | GraphQL (vuelos y hoteles) |
|---|---|---|
| **Fresco**: no se vuelve a consultar | Menos de 5 min desde la última respuesta | Menos de 5 min desde `consultadoEn` |
| **Revalidación** | Al entrar a la vista si están vencidos; si la vista sigue abierta, un temporizador consulta justo a los 5 min | Igual, con `refetch` de Apollo |
| **Mientras se revalida** | Se siguen mostrando los datos anteriores con "Actualizando..." | Igual |
| **Descarte** | Las URLs que ninguna vista está usando y tienen más de 30 min; si hay más de 30, se eliminan las más antiguas. Un 404 descarta lo guardado de esa URL | Lo maneja la caché de Apollo; los datos se revalidan con la misma regla de 5 min |
| **Respaldo** | La última lista de destinos correcta se guarda en `localStorage` con su fecha | — |

Cada vista indica de cuándo son sus datos ("Actualizado hoy a las 15:20") y tiene un botón **Actualizar ahora**.

### Qué muestra la interfaz en cada caso

| Caso | Qué se muestra | Qué dato se conserva | Cuándo se vuelve a consultar | Qué acción queda disponible |
|---|---|---|---|---|
| **Respuesta ilegible** (llega una respuesta, pero el cuerpo no es JSON válido) | "No pudimos leer la respuesta del servidor": se aclara que hay conexión y que el problema está en los datos. Ya no se confunde con un fallo de red | Los datos anteriores si los había (o el respaldo, con su fecha); si no hay nada, solo el mensaje | No se reintenta solo, para no repetir en bucle una respuesta dañada | **Reintentar** y **Ver destinos** |
| **Más de 5 min en una vista** (por ejemplo, con un destino abierto) | A los 5 min aparece "Actualizando..." sin quitar lo que se ve; al terminar, la hora se actualiza | Los datos anteriores, hasta que llegan los nuevos | Automáticamente cada 5 min mientras la vista esté abierta | **Actualizar ahora** en cualquier momento |
| **Falla una revalidación** | Aviso "No pudimos actualizar…", con el motivo y la **fecha de lo que se está viendo** | Los datos anteriores, con su fecha original | Se detiene la revalidación automática hasta que la persona reintenta, o al volver a entrar a la vista | **Reintentar** |
| **Portada sin servicio, con respaldo** | Los destinos guardados + aviso con la fecha de la copia ("18 nov, 13:56") | La copia de `localStorage` | Al pulsar Reintentar o al volver a entrar | **Reintentar** |
| **Portada sin servicio y sin respaldo** | Mensaje de error con el motivo | Nada | Al pulsar Reintentar o al volver a entrar | **Reintentar** y **Ver destinos** |
| **El recurso ya no existe (404)** | "No encontramos lo que buscas" | Se descarta lo guardado de esa URL | No aplica: repetir la consulta no cambia nada | **Ver destinos** |

### Probar fallos desde la consola

En desarrollo (`npm run dev`), el mock queda disponible en `window.msw` para cambiar respuestas sin tocar el código:

```js
// Hacer que el servicio de destinos falle
const { worker, http, graphql, HttpResponse } = window.msw
worker.use(http.get('/api/destinos', () => HttpResponse.json({ mensaje: 'Servicio caído' }, { status: 503 })))

// Respuesta GraphQL ilegible
worker.use(graphql.operation(() => new HttpResponse('<html>', { headers: { 'Content-Type': 'application/json' } })))

// Volver a la normalidad
worker.resetHandlers()
```

## Manejo de estado

- **`useState`**: filtros (búsqueda, región, orden, solo disponibles), plan de viaje, noches, pasajeros y reserva confirmada.
- **`useSyncExternalStore`**: lectura de la caché REST, para que React se entere de cada cambio.
- **`useEffect`**:
  - consulta al entrar a la vista y revalidación a los 5 min (`hooks/useApi.js` y `hooks/useConsultaVigente.js`);
  - guardar el plan en `localStorage` para no perderlo al recargar;
  - título de la pestaña en cada vista;
  - volver arriba al cambiar de ruta.
- **Context** (`PlanViajeProvider`): el plan se comparte entre todas las vistas. El contador del menú "Mi viaje" se actualiza al instante.
- **Apollo** (`useQuery`, `useMutation`): estados de carga y error de cada consulta GraphQL.

## Casos para probar

| Caso | Qué se ve |
|---|---|
| Cusco | Vuelos y hoteles con todos los estados: disponible, pocos cupos y sin disponibilidad |
| Tokio | Todo sin disponibilidad (botones deshabilitados) |
| Isla de Pascua | El destino carga por REST, pero GraphQL responde con error → mensaje + Reintentar |
| `/#/destinos/atlantida` | Error 404 del servicio REST |
| `/#/hoteles/H999` | GraphQL responde `null` → mensaje de "no encontrado" |
| `/#/destinos?simular=500` | Error 500 del servicio REST → si ya se cargaron destinos antes, se muestra la copia guardada con su fecha y Reintentar; si no, mensaje de error + Reintentar |
| `/#/destinos?simular=json` | Respuesta ilegible → "No pudimos leer la respuesta del servidor" (no se confunde con falta de conexión) |
| Reservar 9 pasajeros en un vuelo con 5 asientos | La mutation responde con error y se muestra el motivo |
| Elegir un vuelo de otro destino | Aviso: el plan anterior se reemplaza |

## Pruebas realizadas

### Funcionales (automatizadas con Playwright en Chrome)

| Prueba | Resultado |
|---|---|
| Listado de 9 destinos desde REST; búsqueda "peru" y "coliseo"; filtro Europa | ✅ |
| Vuelos y hoteles de Cusco desde GraphQL; orden por precio y "solo disponibles" | ✅ |
| Elegir vuelo y hotel → barra de resumen y contador en el menú | ✅ |
| Detalle de vuelo y hotel; volver al destino **sin repetir la consulta** (caché de Apollo) | ✅ |
| Inicio → Destinos → Cusco: 1 petición REST de destinos (se reutiliza la caché) | ✅ |
| Mi viaje: cambiar pasajeros/noches recalcula el total; reservar entrega un código | ✅ |
| Después de reservar, la disponibilidad se descuenta sin otra consulta | ✅ |
| Errores REST (404, 500), error GraphQL (Isla de Pascua), elemento inexistente, ruta inexistente | ✅ |
| Recargar en `/mi-viaje` mantiene el plan | ✅ |
| Build servido en una subcarpeta (igual que GitHub Pages) y recarga en una ruta interna | ✅ |

### Vigencia de datos y fallos (reloj simulado con Playwright)

| Prueba | Resultado |
|---|---|
| Respuesta REST ilegible sin respaldo → mensaje de formato (no de conexión) con Reintentar | ✅ |
| Respuesta REST ilegible con respaldo → copia guardada con su fecha + Reintentar | ✅ |
| Respuesta GraphQL ilegible → mensaje de formato | ✅ |
| A los 4 min en Destinos: 0 peticiones. A los 5 min: 1 petición, con los datos visibles mientras se actualiza | ✅ |
| Falla la revalidación → se conservan las 9 tarjetas + aviso con la hora de los datos | ✅ |
| Con error, 10 min más sin peticiones automáticas; Reintentar recupera y quita el aviso | ✅ |
| GraphQL: revalidación a los 5 min sin quitar las tarjetas; si falla, se conservan con aviso | ✅ |
| Volver a un destino antes de 5 min: 0 peticiones; después de 5 min: se revalida | ✅ |
| Portada sin servicio: con respaldo muestra la fecha y Reintentar; sin respaldo, error + Reintentar | ✅ |

### Diseño responsivo (Chrome, sin desborde horizontal en ninguna vista)

| Dispositivo | Ancho | Resultado |
|---|---|---|
| Celular | 375 px | ✅ Tarjetas en una columna; vuelos y hoteles apilados |
| Tablet | 768 px | ✅ |
| Escritorio | 1280 px | ✅ Vuelos y hoteles en dos columnas; resumen del plan fijo al costado |

