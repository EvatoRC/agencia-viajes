import { Link, useParams } from 'react-router'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { urls } from '../services/api'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import OpcionesViaje from '../components/OpcionesViaje'
import BarraPlan from '../components/BarraPlan'
import AvisoDatos from '../components/AvisoDatos'

export default function DestinoDetalle() {
  const { idDestino } = useParams()
  // Información del destino por REST...
  const { datos: destino, cargando, error, reintentar, ...vigencia } = useApi(urls.destino(idDestino))
  useTitulo(destino?.ciudad)

  if (cargando) return <Cargando mensaje="Cargando destino..." />
  // si ya había datos del destino y falló la actualización, se siguen mostrando con un aviso
  if (error && !destino) return <MensajeError error={error} onReintentar={reintentar} />

  return (
    <>
      <p className="migas">
        <Link to="/destinos">Destinos</Link> / {destino.ciudad}
      </p>

      {error && <AvisoDatos {...vigencia} error={error} onReintentar={reintentar} que="los datos del destino" />}

      <section className="cabecera-destino" style={{ background: destino.color }}>
        <span className="cabecera-icono">{destino.icono}</span>
        <div>
          <p className="pais">
            {destino.pais} · {destino.region}
          </p>
          <h1>{destino.ciudad}</h1>
          <p>{destino.descripcion}</p>
        </div>
      </section>

      <section className="actividades-destino">
        <h2>Actividades populares</h2>
        <ul className="actividades">
          {destino.actividades.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      {/* ...y sus vuelos y hoteles por GraphQL. La key reinicia los filtros al cambiar de destino */}
      <OpcionesViaje key={destino.id} destino={destino} />

      <BarraPlan destinoId={destino.id} />
    </>
  )
}
