import { Link, useNavigate, useParams } from 'react-router'
import { DETALLE_VUELO } from '../graphql/consultas'
import { errorGraphQL } from '../graphql/errores'
import { usePlanViaje } from '../hooks/usePlanViaje'
import { useConsultaVigente } from '../hooks/useConsultaVigente'
import AvisoDatos from '../components/AvisoDatos'
import { useTitulo } from '../hooks/useTitulo'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import Disponibilidad from '../components/Disponibilidad'
import { formatoFecha, formatoHora, formatoPrecio, textoEscalas } from '../utils/formato'

export default function VueloDetalle() {
  const { idVuelo } = useParams()
  const navigate = useNavigate()
  const { plan, elegirVuelo } = usePlanViaje()
  const { data, cargando, actualizando, error, fecha, reintentar } = useConsultaVigente(DETALLE_VUELO, {
    variables: { id: idVuelo },
    fechaDe: (d) => d.vuelo?.consultadoEn, // null si no existe
  })
  const vuelo = data?.vuelo
  useTitulo(vuelo ? `Vuelo ${vuelo.numero}` : 'Vuelo')

  if (cargando) return <Cargando mensaje="Cargando detalle del vuelo..." />
  if (error && !data) return <MensajeError error={errorGraphQL(error)} onReintentar={reintentar} />
  // GraphQL responde null (no un 404) cuando el vuelo no existe
  if (!vuelo) return <MensajeError error={{ tipo: 'no-encontrado', message: `No existe el vuelo ${idVuelo}` }} />

  const elegido = plan.vuelo?.id === vuelo.id

  return (
    <section className="detalle">
      <p className="migas">
        <Link to="/destinos">Destinos</Link> / <Link to={`/destinos/${vuelo.destino.id}`}>{vuelo.destino.ciudad}</Link>{' '}
        / Vuelo {vuelo.numero}
      </p>
      <h1>
        ✈️ {vuelo.aerolinea} {vuelo.numero}
      </h1>
      <p className="subtitulo">
        {vuelo.origen} → {vuelo.destino.ciudad}, {vuelo.destino.pais}
      </p>

      <AvisoDatos
        fecha={fecha}
        error={error ? errorGraphQL(error) : null}
        actualizando={actualizando}
        onReintentar={reintentar}
        que="la disponibilidad"
      />

      <div className="detalle-grilla">
        <dl className="ficha">
          <dt>Salida</dt>
          <dd>
            {formatoFecha(vuelo.salida)}, {formatoHora(vuelo.salida)} h
          </dd>
          <dt>Llegada</dt>
          <dd>
            {formatoFecha(vuelo.llegada)}, {formatoHora(vuelo.llegada)} h (hora local)
          </dd>
          <dt>Escalas</dt>
          <dd>{textoEscalas(vuelo.escalas)}</dd>
          <dt>Clase</dt>
          <dd>{vuelo.clase}</dd>
          <dt>Equipaje incluido</dt>
          <dd>{vuelo.equipaje}</dd>
          <dt>Disponibilidad</dt>
          <dd>
            <Disponibilidad cantidad={vuelo.asientosDisponibles} unidad="asientos" />
          </dd>
        </dl>

        <aside className="caja-precio">
          <p className="precio precio-grande">{formatoPrecio(vuelo.precio)}</p>
          <p className="texto-tenue">por pasajero, solo ida</p>
          <button
            className="btn"
            disabled={!vuelo.disponible || elegido}
            onClick={() => elegirVuelo(vuelo.destino, vuelo)}
          >
            {elegido ? '✓ Vuelo elegido' : 'Elegir este vuelo'}
          </button>
          <button className="btn btn-secundario" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </aside>
      </div>
    </section>
  )
}
