import { Link } from 'react-router'
import Disponibilidad from './Disponibilidad'
import { diasExtra, formatoFecha, formatoHora, formatoPrecio, textoEscalas } from '../utils/formato'

export default function TarjetaVuelo({ vuelo, seleccionado, onElegir }) {
  return (
    <article className={`opcion ${seleccionado ? 'opcion-elegida' : ''} ${!vuelo.disponible ? 'opcion-agotada' : ''}`}>
      <div className="opcion-principal">
        <p className="opcion-titulo">
          {vuelo.aerolinea} <span className="texto-tenue">· {vuelo.numero}</span>
        </p>
        <p className="horario">
          <strong>{formatoHora(vuelo.salida)}</strong> → <strong>{formatoHora(vuelo.llegada)}</strong>
          {diasExtra(vuelo.salida, vuelo.llegada)}
          <span className="texto-tenue"> · {textoEscalas(vuelo.escalas)}</span>
        </p>
        <p className="texto-tenue">📅 {formatoFecha(vuelo.salida)}</p>
        <Disponibilidad cantidad={vuelo.asientosDisponibles} unidad="asientos" />
      </div>
      <div className="opcion-lateral">
        <p className="precio">{formatoPrecio(vuelo.precio)}</p>
        <p className="texto-tenue texto-chico">por pasajero</p>
        <button className="btn btn-chico" onClick={() => onElegir(vuelo)} disabled={!vuelo.disponible || seleccionado}>
          {seleccionado ? '✓ Elegido' : 'Elegir'}
        </button>
        <Link to={`/vuelos/${vuelo.id}`} className="enlace-detalle">
          Ver detalle
        </Link>
      </div>
    </article>
  )
}
