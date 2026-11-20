import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client'

// Convierte un error de Apollo al mismo formato que usa MensajeError para los errores REST
export function errorGraphQL(error) {
  if (CombinedGraphQLErrors.is(error)) {
    // el servidor respondió, pero la consulta trajo errores (ej: servicio caído para un destino)
    return { tipo: 'servidor', message: error.errors[0].message }
  }
  if (ServerParseError.is(error)) {
    // hubo respuesta (hay conexión), pero el cuerpo no es JSON válido
    return {
      tipo: 'formato',
      message: 'El servidor GraphQL respondió, pero los datos llegaron en un formato que no se pudo leer',
      status: error.statusCode,
    }
  }
  if (ServerError.is(error)) {
    return { tipo: 'servidor', message: 'El servidor GraphQL respondió con un error', status: error.statusCode }
  }
  return { tipo: 'red', message: 'No se pudo conectar con el servidor GraphQL' }
}
