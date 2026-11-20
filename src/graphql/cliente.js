import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

// Cliente Apollo: todas las consultas GraphQL van por POST a /graphql (lo responde el mock de MSW).
// InMemoryCache guarda los resultados por id (ej: Vuelo:V101), así una misma consulta no se repite
// al volver a una vista, y si una mutation devuelve un vuelo actualizado, todas las vistas se refrescan solas.
export const clienteApollo = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
})
