import { Link } from 'react-router'
import Disponibilidad from './Disponibilidad'
import Estrellas from './Estrellas'
import { formatoPrecio } from '../utils/formato'

export default function TarjetaHotel({ hotel, seleccionado, onElegir }) {
  return (
    <article className={`opcion ${seleccionado ? 'opcion-elegida' : ''} ${!hotel.disponible ? 'opcion-agotada' : ''}`}>
      <div className="opcion-principal">
        <p className="opcion-titulo">{hotel.nombre}</p>
        <Estrellas cantidad={hotel.estrellas} />
        <p className="texto-tenue">📍 {hotel.barrio}</p>
        <Disponibilidad cantidad={hotel.habitacionesDisponibles} unidad="habitaciones" />
      </div>
      <div className="opcion-lateral">
        <p className="precio">{formatoPrecio(hotel.precioNoche)}</p>
        <p className="texto-tenue texto-chico">por noche</p>
        <button className="btn btn-chico" onClick={() => onElegir(hotel)} disabled={!hotel.disponible || seleccionado}>
          {seleccionado ? '✓ Elegido' : 'Elegir'}
        </button>
        <Link to={`/hoteles/${hotel.id}`} className="enlace-detalle">
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
