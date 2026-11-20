import { Link } from 'react-router'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { urls } from '../services/api'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import AvisoDatos from '../components/AvisoDatos'
import TarjetaDestino from '../components/TarjetaDestino'

export default function Inicio() {
  useTitulo('Inicio')
  // misma URL y respaldo que la vista Destinos: comparten caché y no se repite la petición
  const { datos: destinos, cargando, error, reintentar, ...vigencia } = useApi(urls.destinos(), {
    respaldo: 'respaldoDestinos',
  })

  return (
    <>
      <section className="hero">
        <h1>Planifica tu próximo viaje en tres pasos</h1>
        <p>Elige un destino, compara vuelos y hoteles con precios y disponibilidad reales, y arma tu viaje.</p>
        <Link to="/destinos" className="btn btn-claro">
          Explorar destinos
        </Link>
      </section>

      <ol className="pasos">
        <li>
          <span>1</span>
          <strong>Elige un destino</strong>
          <p>Revisa el país y las actividades más populares.</p>
        </li>
        <li>
          <span>2</span>
          <strong>Compara vuelos y hoteles</strong>
          <p>Precios, fechas y cupos disponibles en cada opción.</p>
        </li>
        <li>
          <span>3</span>
          <strong>Arma tu viaje</strong>
          <p>Ajusta noches y pasajeros, revisa el total y reserva.</p>
        </li>
      </ol>

      <section>
        <h2>Destinos destacados</h2>
        {cargando && <Cargando mensaje="Cargando destinos..." tarjetas={3} />}
        {/* sin datos ni respaldo: mensaje de error con Reintentar */}
        {!cargando && error && !destinos && <MensajeError error={error} onReintentar={reintentar} compacto />}
        {destinos && (
          <>
            <AvisoDatos {...vigencia} error={error} onReintentar={reintentar} que="los destinos" />
            <div className="grilla">
              {destinos.slice(0, 3).map((d) => (
                <TarjetaDestino key={d.id} destino={d} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
