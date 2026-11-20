import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useApi } from '../hooks/useApi'
import { useTitulo } from '../hooks/useTitulo'
import { urls } from '../services/api'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import TarjetaDestino from '../components/TarjetaDestino'
import AvisoDatos from '../components/AvisoDatos'

// Quita tildes y mayúsculas para que "peru" encuentre "Perú"
const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Destinos() {
  useTitulo('Destinos')
  // /destinos?simular=500 (o 404, json) permite probar cómo se ve un error del servicio REST
  const [params] = useSearchParams()
  const { datos: destinos, cargando, error, reintentar, ...vigencia } = useApi(
    urls.destinos(params.get('simular') || ''),
    { respaldo: 'respaldoDestinos' }
  )

  const [busqueda, setBusqueda] = useState('')
  const [region, setRegion] = useState('Todas')

  const regiones = useMemo(() => (destinos ? ['Todas', ...new Set(destinos.map((d) => d.region))] : []), [destinos])

  // Filtro en el cliente: escribir o cambiar de región no hace nuevas peticiones
  const filtrados = useMemo(() => {
    if (!destinos) return []
    const texto = normalizar(busqueda.trim())
    return destinos.filter((d) => {
      const coincideRegion = region === 'Todas' || d.region === region
      const coincideTexto = [d.ciudad, d.pais, ...d.actividades].some((campo) => normalizar(campo).includes(texto))
      return coincideRegion && coincideTexto
    })
  }, [destinos, busqueda, region])

  return (
    <section>
      <h1>Destinos</h1>
      <p className="subtitulo">Elige un destino para ver sus vuelos y hoteles disponibles.</p>

      {cargando && <Cargando mensaje="Cargando destinos..." tarjetas={6} />}
      {/* sin datos ni respaldo: mensaje de error con Reintentar */}
      {!cargando && error && !destinos && <MensajeError error={error} onReintentar={reintentar} />}

      {destinos && (
        <>
          <AvisoDatos {...vigencia} error={error} onReintentar={reintentar} que="los destinos" />
          <div className="filtros">
            <input
              type="search"
              className="buscador"
              placeholder="Buscar por ciudad, país o actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar destino"
            />
            <div className="chips" role="group" aria-label="Filtrar por región">
              {regiones.map((r) => (
                <button key={r} className={`chip ${region === r ? 'chip-activo' : ''}`} onClick={() => setRegion(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {filtrados.length === 0 ? (
            <p className="vacio">No encontramos destinos que coincidan con tu búsqueda.</p>
          ) : (
            <div className="grilla">
              {filtrados.map((d) => (
                <TarjetaDestino key={d.id} destino={d} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
