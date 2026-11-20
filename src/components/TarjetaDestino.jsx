import { Link } from 'react-router'

export default function TarjetaDestino({ destino }) {
  return (
    <Link to={`/destinos/${destino.id}`} className="tarjeta tarjeta-destino">
      <div className="banda" style={{ background: destino.color }}>
        <span className="banda-icono">{destino.icono}</span>
      </div>
      <div className="tarjeta-cuerpo">
        <p className="pais">
          {destino.pais} · {destino.region}
        </p>
        <h3>{destino.ciudad}</h3>
        <p className="texto-tenue">{destino.descripcion}</p>
        <ul className="actividades" aria-label="Actividades populares">
          {destino.actividades.slice(0, 3).map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <span className="ver-mas">Ver vuelos y hoteles →</span>
      </div>
    </Link>
  )
}
