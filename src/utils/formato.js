export const formatoPrecio = (valor) =>
  valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

// Las fechas del mock vienen como "2026-12-12T07:30" o "2026-12-01".
// A las que no traen hora les agrego mediodía, porque "2026-12-01" solo se interpreta
// como medianoche UTC y en Chile se mostraría el día anterior.
export const formatoFecha = (texto) =>
  new Date(texto.length === 10 ? `${texto}T12:00` : texto).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export const formatoHora = (texto) => texto.slice(11, 16)

// Días de diferencia entre salida y llegada (ej: vuelo nocturno que llega al día siguiente)
export function diasExtra(salida, llegada) {
  const dias = (new Date(llegada.slice(0, 10)) - new Date(salida.slice(0, 10))) / 86400000
  return dias > 0 ? ` (+${dias} ${dias === 1 ? 'día' : 'días'})` : ''
}

export const textoEscalas = (n) => (n === 0 ? 'Directo' : n === 1 ? '1 escala' : `${n} escalas`)

// 2 personas por habitación
export const habitacionesPara = (pasajeros) => Math.ceil(pasajeros / 2)

// Total estimado del plan: vuelo por pasajero + hotel por noche y habitación
export function calcularTotal(plan) {
  const vuelo = plan.vuelo ? plan.vuelo.precio * plan.pasajeros : 0
  const hotel = plan.hotel ? plan.hotel.precioNoche * plan.noches * habitacionesPara(plan.pasajeros) : 0
  return { vuelo, hotel, total: vuelo + hotel }
}

// Momento en que se obtuvieron unos datos: "hoy a las 15:20" o "19 nov, 15:20"
export function formatoMomento(timestamp) {
  const fecha = new Date(timestamp)
  const hora = fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  if (fecha.toDateString() === new Date().toDateString()) return `hoy a las ${hora}`
  return `${fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}, ${hora}`
}
