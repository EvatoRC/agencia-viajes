// Indicador de carga: un mensaje con spinner y tarjetas "esqueleto"
export default function Cargando({ mensaje = 'Cargando...', tarjetas = 0 }) {
  return (
    <div className="cargando" aria-live="polite" aria-busy="true">
      <div className="cargando-texto">
        <span className="spinner" /> {mensaje}
      </div>
      {tarjetas > 0 && (
        <div className="grilla">
          {Array.from({ length: tarjetas }).map((_, i) => (
            <div key={i} className="tarjeta esqueleto" />
          ))}
        </div>
      )}
    </div>
  )
}
