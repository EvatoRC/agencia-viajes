import { Link } from 'react-router'

// Texto claro según el tipo de error (sirve para errores REST y GraphQL)
const textos = {
  'no-encontrado': {
    titulo: 'No encontramos lo que buscas',
    ayuda: 'Puede que el enlace esté mal escrito o que ya no exista.',
  },
  servidor: {
    titulo: 'El servicio tuvo un problema',
    ayuda: 'No es un error tuyo. Intenta de nuevo en unos segundos o revisa otro destino.',
  },
  formato: {
    titulo: 'No pudimos leer la respuesta del servidor',
    ayuda: 'La conexión funciona, pero los datos recibidos llegaron dañados o incompletos. Reintenta en unos segundos; si se repite, prueba con otro destino.',
  },
  timeout: {
    titulo: 'La respuesta está tardando demasiado',
    ayuda: 'El servidor no respondió a tiempo. Vuelve a intentarlo.',
  },
  red: {
    titulo: 'Sin conexión con el servidor',
    ayuda: 'Revisa tu conexión a internet y vuelve a intentarlo.',
  },
  solicitud: {
    titulo: 'La solicitud no es válida',
    ayuda: 'Vuelve al inicio e intenta navegar desde el menú.',
  },
}

export default function MensajeError({ error, onReintentar, compacto = false }) {
  const texto = textos[error?.tipo] || textos.servidor
  // en un 404 no muestro "Reintentar": repetir la misma petición no cambia nada
  const puedeReintentar = onReintentar && error?.tipo !== 'no-encontrado'

  return (
    <div className={`error ${compacto ? 'error-compacto' : ''}`} role="alert">
      <h2>⚠️ {texto.titulo}</h2>
      <p className="error-detalle">
        {error?.message}
        {error?.status && <span className="codigo">Código {error.status}</span>}
      </p>
      <p>{texto.ayuda}</p>
      <div className="acciones">
        {puedeReintentar && (
          <button className="btn" onClick={onReintentar}>
            🔄 Reintentar
          </button>
        )}
        <Link className="btn btn-secundario" to="/destinos">
          Ver destinos
        </Link>
      </div>
    </div>
  )
}
