export default function Estrellas({ cantidad }) {
  return (
    <span className="estrellas" aria-label={`${cantidad} estrellas`}>
      {'★'.repeat(cantidad)}
      <span className="estrellas-vacias">{'★'.repeat(5 - cantidad)}</span>
    </span>
  )
}
