import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { ApolloProvider } from '@apollo/client/react'
import { clienteApollo } from './graphql/cliente'
import PlanViajeProvider from './context/PlanViajeProvider'
import App from './App'
import './index.css'

// El mock (REST + GraphQL) se activa antes de montar React, para que ninguna petición se escape.
// Queda activo también en el build: el sitio publicado en GitHub Pages no tiene backend real.
async function iniciarMock() {
  const { worker } = await import('./mocks/browser')

  // Solo en desarrollo: permite cambiar respuestas del mock desde la consola del navegador
  // (ver "Probar fallos desde la consola" en el README)
  if (import.meta.env.DEV) {
    const msw = await import('msw')
    window.msw = { worker, http: msw.http, graphql: msw.graphql, HttpResponse: msw.HttpResponse }
  }

  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass',
  })
}

iniciarMock()
  .catch((error) => console.error('No se pudo iniciar el mock de la API:', error))
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        {/* HashRouter: en GitHub Pages las rutas no dan 404 al recargar la página */}
        <HashRouter>
          <ApolloProvider client={clienteApollo}>
            <PlanViajeProvider>
              <App />
            </PlanViajeProvider>
          </ApolloProvider>
        </HashRouter>
      </StrictMode>
    )
  })
