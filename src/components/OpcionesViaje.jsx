import { useMemo, useState } from 'react'
import { OPCIONES_DESTINO } from '../graphql/consultas'
import { useConsultaVigente } from '../hooks/useConsultaVigente'
import { errorGraphQL } from '../graphql/errores'
import { usePlanViaje } from '../hooks/usePlanViaje'
import Cargando from './Cargando'
import AvisoDatos from './AvisoDatos'
import MensajeError from './MensajeError'
import TarjetaVuelo from './TarjetaVuelo'
import TarjetaHotel from './TarjetaHotel'

// Ordena y filtra una lista (sin modificar la original)
function preparar(lista, { orden, soloDisponibles }, campoPrecio) {
  const filtrada = soloDisponibles ? lista.filter((x) => x.disponible) : [...lista]
  return filtrada.sort((a, b) => (orden === 'menor' ? a[campoPrecio] - b[campoPrecio] : b[campoPrecio] - a[campoPrecio]))
}

// Vuelos y hoteles de un destino, obtenidos con UNA consulta GraphQL (Apollo Client)
export default function OpcionesViaje({ destino }) {
  const { data, cargando, actualizando, error, fecha, reintentar } = useConsultaVigente(OPCIONES_DESTINO, {
    variables: { destinoId: destino.id },
    fechaDe: (d) => d.disponibilidad.consultadoEn,
  })
  const { plan, elegirVuelo, elegirHotel } = usePlanViaje()
  const [filtros, setFiltros] = useState({ orden: 'menor', soloDisponibles: false })

  const disponibilidad = data?.disponibilidad
  const vuelos = useMemo(
    () => (disponibilidad ? preparar(disponibilidad.vuelos, filtros, 'precio') : []),
    [disponibilidad, filtros]
  )
  const hoteles = useMemo(
    () => (disponibilidad ? preparar(disponibilidad.hoteles, filtros, 'precioNoche') : []),
    [disponibilidad, filtros]
  )

  if (cargando) return <Cargando mensaje="Consultando vuelos y hoteles disponibles..." tarjetas={2} />
  // sin datos que mostrar: mensaje de error con Reintentar
  if (error && !disponibilidad) return <MensajeError error={errorGraphQL(error)} onReintentar={reintentar} compacto />

  // Lo que se guarda en el plan: solo los datos necesarios para mostrar el resumen y calcular el total
  const datosDestino = { id: destino.id, ciudad: destino.ciudad, pais: destino.pais }
  const planEsDeOtroDestino = plan.destino && plan.destino.id !== destino.id

  return (
    <section aria-label="Vuelos y hoteles">
      {/* hora de la disponibilidad que se está viendo; si falla una actualización, se avisa */}
      <AvisoDatos
        fecha={fecha}
        error={error ? errorGraphQL(error) : null}
        actualizando={actualizando}
        onReintentar={reintentar}
        que="la disponibilidad"
      />

      <div className="filtros">
        <label>
          Ordenar por precio{' '}
          <select value={filtros.orden} onChange={(e) => setFiltros({ ...filtros, orden: e.target.value })}>
            <option value="menor">Menor a mayor</option>
            <option value="mayor">Mayor a menor</option>
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={filtros.soloDisponibles}
            onChange={(e) => setFiltros({ ...filtros, soloDisponibles: e.target.checked })}
          />
          Solo con disponibilidad
        </label>
      </div>

      {planEsDeOtroDestino && (
        <p className="aviso">
          Ya tienes un plan para <strong>{plan.destino.ciudad}</strong>. Si eliges una opción aquí, ese plan se reemplaza
          por este destino.
        </p>
      )}

      <div className="columnas">
        <div>
          <h2>✈️ Vuelos desde Santiago</h2>
          {vuelos.length === 0 ? (
            <p className="vacio">No hay vuelos {filtros.soloDisponibles ? 'con disponibilidad ' : ''}para este destino.</p>
          ) : (
            vuelos.map((v) => (
              <TarjetaVuelo
                key={v.id}
                vuelo={v}
                seleccionado={plan.vuelo?.id === v.id}
                onElegir={(vuelo) => elegirVuelo(datosDestino, vuelo)}
              />
            ))
          )}
        </div>

        <div>
          <h2>🏨 Hoteles</h2>
          {hoteles.length === 0 ? (
            <p className="vacio">No hay hoteles {filtros.soloDisponibles ? 'con disponibilidad ' : ''}para este destino.</p>
          ) : (
            hoteles.map((h) => (
              <TarjetaHotel
                key={h.id}
                hotel={h}
                seleccionado={plan.hotel?.id === h.id}
                onElegir={(hotel) => elegirHotel(datosDestino, hotel)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
