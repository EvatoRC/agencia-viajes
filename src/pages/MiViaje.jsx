import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation } from '@apollo/client/react'
import { CREAR_RESERVA } from '../graphql/consultas'
import { errorGraphQL } from '../graphql/errores'
import { usePlanViaje } from '../hooks/usePlanViaje'
import { useTitulo } from '../hooks/useTitulo'
import Estrellas from '../components/Estrellas'
import {
  calcularTotal,
  diasExtra,
  formatoFecha,
  formatoHora,
  formatoPrecio,
  habitacionesPara,
  textoEscalas,
} from '../utils/formato'

// Mantiene un número dentro de un rango (para los campos de noches y pasajeros)
const limitar = (valor, min, max) => Math.min(max, Math.max(min, Number(valor) || min))

export default function MiViaje() {
  useTitulo('Mi viaje')
  const { plan, quitar, cambiarNoches, cambiarPasajeros, limpiar } = usePlanViaje()
  const [crearReserva, { loading: reservando, error }] = useMutation(CREAR_RESERVA)
  const [reserva, setReserva] = useState(null) // datos de la reserva confirmada

  const reservar = async () => {
    try {
      const { data } = await crearReserva({
        variables: {
          vueloId: plan.vuelo?.id ?? null,
          hotelId: plan.hotel?.id ?? null,
          noches: plan.noches,
          pasajeros: plan.pasajeros,
        },
      })
      setReserva({ ...data.crearReserva, destino: plan.destino })
      limpiar()
    } catch {
      // el error queda en "error" de useMutation y se muestra abajo
    }
  }

  // --- Reserva confirmada ---
  if (reserva) {
    return (
      <section className="confirmacion">
        <h1>🎉 ¡Reserva confirmada!</h1>
        <p>
          Tu viaje a <strong>{reserva.destino.ciudad}</strong> quedó reservado.
        </p>
        <p className="codigo-reserva">{reserva.codigo}</p>
        <p className="texto-tenue">
          {reserva.pasajeros} {reserva.pasajeros === 1 ? 'pasajero' : 'pasajeros'}
          {reserva.hotel && ` · ${reserva.noches} noches`} · Total {formatoPrecio(reserva.total)}
        </p>
        <Link to="/destinos" className="btn">
          Planificar otro viaje
        </Link>
      </section>
    )
  }

  // --- Plan vacío ---
  if (!plan.destino) {
    return (
      <section className="vacio">
        <h1>Mi viaje</h1>
        <p>Todavía no eliges un vuelo ni un hotel.</p>
        <Link to="/destinos" className="btn">
          Explorar destinos
        </Link>
      </section>
    )
  }

  const totales = calcularTotal(plan)
  const habitaciones = habitacionesPara(plan.pasajeros)

  return (
    <section>
      <h1>Mi viaje a {plan.destino.ciudad}</h1>
      <p className="subtitulo">
        {plan.destino.pais} · <Link to={`/destinos/${plan.destino.id}`}>Cambiar vuelo u hotel</Link>
      </p>

      <div className="detalle-grilla">
        <div>
          {/* Vuelo */}
          <article className="resumen-item">
            <h2>✈️ Vuelo</h2>
            {plan.vuelo ? (
              <>
                <p className="opcion-titulo">
                  {plan.vuelo.aerolinea} · {plan.vuelo.numero}
                </p>
                <p className="texto-tenue">
                  {formatoFecha(plan.vuelo.salida)} · {formatoHora(plan.vuelo.salida)} →{' '}
                  {formatoHora(plan.vuelo.llegada)}
                  {diasExtra(plan.vuelo.salida, plan.vuelo.llegada)} · {textoEscalas(plan.vuelo.escalas)}
                </p>
                <p>
                  {formatoPrecio(plan.vuelo.precio)} × {plan.pasajeros}{' '}
                  {plan.pasajeros === 1 ? 'pasajero' : 'pasajeros'} = <strong>{formatoPrecio(totales.vuelo)}</strong>
                </p>
                <button className="btn-texto" onClick={() => quitar('vuelo')}>
                  Quitar vuelo
                </button>
              </>
            ) : (
              <p className="texto-tenue">
                Sin vuelo. <Link to={`/destinos/${plan.destino.id}`}>Elegir un vuelo</Link>
              </p>
            )}
          </article>

          {/* Hotel */}
          <article className="resumen-item">
            <h2>🏨 Hotel</h2>
            {plan.hotel ? (
              <>
                <p className="opcion-titulo">{plan.hotel.nombre}</p>
                <p className="texto-tenue">
                  <Estrellas cantidad={plan.hotel.estrellas} /> · {plan.hotel.barrio}
                </p>
                <p>
                  {formatoPrecio(plan.hotel.precioNoche)} × {plan.noches} noches × {habitaciones}{' '}
                  {habitaciones === 1 ? 'habitación' : 'habitaciones'} = <strong>{formatoPrecio(totales.hotel)}</strong>
                </p>
                <button className="btn-texto" onClick={() => quitar('hotel')}>
                  Quitar hotel
                </button>
              </>
            ) : (
              <p className="texto-tenue">
                Sin hotel. <Link to={`/destinos/${plan.destino.id}`}>Elegir un hotel</Link>
              </p>
            )}
          </article>
        </div>

        <aside className="caja-precio">
          <label className="campo">
            Pasajeros
            <input
              type="number"
              min="1"
              max="9"
              value={plan.pasajeros}
              onChange={(e) => cambiarPasajeros(limitar(e.target.value, 1, 9))}
            />
          </label>
          {plan.hotel && (
            <label className="campo">
              Noches
              <input
                type="number"
                min="1"
                max="30"
                value={plan.noches}
                onChange={(e) => cambiarNoches(limitar(e.target.value, 1, 30))}
              />
            </label>
          )}
          <p className="texto-tenue texto-chico">Habitaciones dobles: {habitaciones}</p>

          <p className="total">
            Total estimado
            <span className="precio precio-grande">{formatoPrecio(totales.total)}</span>
          </p>

          {error && (
            <p className="error error-compacto" role="alert">
              ⚠️ No se pudo reservar: {errorGraphQL(error).message}
            </p>
          )}

          <button className="btn" onClick={reservar} disabled={reservando}>
            {reservando ? 'Reservando...' : 'Reservar viaje'}
          </button>
          <button className="btn btn-secundario" onClick={limpiar} disabled={reservando}>
            Vaciar plan
          </button>
        </aside>
      </div>
    </section>
  )
}
