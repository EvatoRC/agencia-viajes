// Etiqueta de disponibilidad: verde con cupos, amarilla si quedan pocos, gris si no hay
export default function Disponibilidad({ cantidad, unidad }) {
  if (cantidad === 0) return <span className="etiqueta etiqueta-agotado">Sin disponibilidad</span>
  if (cantidad <= 3) {
    return (
      <span className="etiqueta etiqueta-pocos">
        ¡Quedan {cantidad} {unidad}!
      </span>
    )
  }
  return (
    <span className="etiqueta etiqueta-ok">
      {cantidad} {unidad} disponibles
    </span>
  )
}
