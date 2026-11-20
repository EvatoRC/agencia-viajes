import { NavLink, Outlet } from 'react-router'
import { usePlanViaje } from '../hooks/usePlanViaje'
import VolverArriba from './VolverArriba'

// Estructura común: header con navegación, contenido de cada ruta y footer
export default function Layout() {
  const { plan } = usePlanViaje()
  const elegidos = (plan.vuelo ? 1 : 0) + (plan.hotel ? 1 : 0)

  return (
    <>
      <VolverArriba />
      <header className="header">
        <NavLink to="/" className="logo">
          ✈️ Rumbo Viajes
        </NavLink>
        <nav className="nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/destinos">Destinos</NavLink>
          <NavLink to="/mi-viaje">
            Mi viaje
            {elegidos > 0 && (
              <span className="contador-nav" aria-label={`${elegidos} elementos en el plan`}>
                {elegidos}
              </span>
            )}
          </NavLink>
        </nav>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      <footer className="footer">
        Rumbo Viajes · Destinos vía API REST mock · Vuelos y hoteles vía API GraphQL mock (MSW + Apollo Client)
      </footer>
    </>
  )
}
