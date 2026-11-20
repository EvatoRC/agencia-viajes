import { Link } from 'react-router'
import { useTitulo } from '../hooks/useTitulo'

export default function NoEncontrada() {
  useTitulo('Página no encontrada')
  return (
    <section className="vacio">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn">
        Volver al inicio
      </Link>
    </section>
  )
}
