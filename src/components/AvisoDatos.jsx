import { formatoMomento } from '../utils/formato'

// Informa de cuándo son los datos que se están viendo y qué se puede hacer.
//  - Todo bien: "Actualizado hoy a las 15:20" + opción de actualizar.
//  - Revalidando: se siguen viendo los datos anteriores con "Actualizando...".
//  - Falló la actualización pero hay datos: aviso con la fecha de esos datos y "Reintentar".
export default function AvisoDatos({ fecha, origen, error, actualizando, onReintentar, que = 'datos' }) {
  if (!fecha) return null

  if (error && !actualizando) {
    const fuente = origen === 'respaldo' ? 'la última copia guardada' : 'la última consulta exitosa'
    return (
      <div className="aviso aviso-datos" role="status">
        <span>
          ⚠️ No pudimos actualizar {que} ({error.message}). Lo que ves es {fuente}, de{' '}
          <strong>{formatoMomento(fecha)}</strong>, y podría no estar al día.
        </span>
        <button className="btn btn-chico" onClick={onReintentar}>
          🔄 Reintentar
        </button>
      </div>
    )
  }

  return (
    <p className="estado-datos" role="status">
      {actualizando ? (
        <>
          <span className="spinner spinner-chico" /> Actualizando {que}...
        </>
      ) : (
        <>
          Actualizado {formatoMomento(fecha)} ·{' '}
          <button className="btn-texto btn-texto-neutro" onClick={onReintentar}>
            Actualizar ahora
          </button>
        </>
      )}
    </p>
  )
}
