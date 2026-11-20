import { Link, useNavigate, useParams } from 'react-router'
import { DETALLE_HOTEL } from '../graphql/consultas'
import { errorGraphQL } from '../graphql/errores'
import { usePlanViaje } from '../hooks/usePlanViaje'
import { useConsultaVigente } from '../hooks/useConsultaVigente'
import AvisoDatos from '../components/AvisoDatos'
import { useTitulo } from '../hooks/useTitulo'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import Disponibilidad from '../components/Disponibilidad'
import Estrellas from '../components/Estrellas'
import { formatoFecha, formatoPrecio } from '../utils/formato'

export default function HotelDetalle() {
  const { idHotel } = useParams()
  const navigate = useNavigate()
  const { plan, elegirHotel } = usePlanViaje()
  const { data, cargando, actualizando, error, fecha, reintentar } = useConsultaVigente(DETALLE_HOTEL, {
    variables: { id: idHotel },
    fechaDe: (d) => d.hotel?.consultadoEn, // null si no existe
  })
  const hotel = data?.hotel
  useTitulo(hotel?.nombre || 'Hotel')

  if (cargando) return <Cargando mensaje="Cargando detalle del hotel..." />
  if (error && !data) return <MensajeError error={errorGraphQL(error)} onReintentar={reintentar} />
  if (!hotel) return <MensajeError error={{ tipo: 'no-encontrado', message: `No existe el hotel ${idHotel}` }} />

  const elegido = plan.hotel?.id === hotel.id

  return (
    <section className="detalle">
      <p className="migas">
        <Link to="/destinos">Destinos</Link> / <Link to={`/destinos/${hotel.destino.id}`}>{hotel.destino.ciudad}</Link>{' '}
        / {hotel.nombre}
      </p>
      <h1>🏨 {hotel.nombre}</h1>
      <p className="subtitulo">
        <Estrellas cantidad={hotel.estrellas} /> · {hotel.barrio}, {hotel.destino.ciudad}
      </p>

      <AvisoDatos
        fecha={fecha}
        error={error ? errorGraphQL(error) : null}
        actualizando={actualizando}
        onReintentar={reintentar}
        que="la disponibilidad"
      />

      <div className="detalle-grilla">
        <div>
          <p>{hotel.descripcion}</p>
          <h2>Servicios</h2>
          <ul className="actividades">
            {hotel.servicios.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <dl className="ficha">
            <dt>Fechas con disponibilidad</dt>
            <dd>
              Del {formatoFecha(hotel.disponibleDesde)} al {formatoFecha(hotel.disponibleHasta)}
            </dd>
            <dt>Habitaciones</dt>
            <dd>
              <Disponibilidad cantidad={hotel.habitacionesDisponibles} unidad="habitaciones" />
            </dd>
          </dl>
        </div>

        <aside className="caja-precio">
          <p className="precio precio-grande">{formatoPrecio(hotel.precioNoche)}</p>
          <p className="texto-tenue">por noche, habitación doble</p>
          <button
            className="btn"
            disabled={!hotel.disponible || elegido}
            onClick={() => elegirHotel(hotel.destino, hotel)}
          >
            {elegido ? '✓ Hotel elegido' : 'Elegir este hotel'}
          </button>
          <button className="btn btn-secundario" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </aside>
      </div>
    </section>
  )
}
