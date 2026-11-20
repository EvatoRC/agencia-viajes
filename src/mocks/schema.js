import { buildSchema } from 'graphql'
import { destinos, vuelos, hoteles } from './data'

// Esquema GraphQL del mock. Con buildSchema + graphql() el mock se comporta como un
// servidor real: valida la consulta y devuelve SOLO los campos que el cliente pidió.
export const schema = buildSchema(`
  type Destino {
    id: ID!
    ciudad: String!
    pais: String!
  }

  type Vuelo {
    id: ID!
    aerolinea: String!
    numero: String!
    origen: String!
    salida: String!
    llegada: String!
    escalas: Int!
    clase: String!
    equipaje: String!
    precio: Int!
    asientosDisponibles: Int!
    disponible: Boolean!
    destino: Destino!
    consultadoEn: String!
  }

  type Hotel {
    id: ID!
    nombre: String!
    estrellas: Int!
    barrio: String!
    precioNoche: Int!
    habitacionesDisponibles: Int!
    disponible: Boolean!
    disponibleDesde: String!
    disponibleHasta: String!
    servicios: [String!]!
    descripcion: String!
    destino: Destino!
    consultadoEn: String!
  }

  # Vuelos y hoteles de un destino, con la hora en que el servidor los consultó
  type Disponibilidad {
    destinoId: ID!
    consultadoEn: String!
    vuelos: [Vuelo!]!
    hoteles: [Hotel!]!
  }

  type Reserva {
    codigo: String!
    vuelo: Vuelo
    hotel: Hotel
    noches: Int!
    pasajeros: Int!
    total: Int!
  }

  type Query {
    disponibilidad(destinoId: ID!): Disponibilidad!
    vuelos(destinoId: ID!): [Vuelo!]!
    hoteles(destinoId: ID!): [Hotel!]!
    vuelo(id: ID!): Vuelo
    hotel(id: ID!): Hotel
  }

  type Mutation {
    crearReserva(vueloId: ID, hotelId: ID, noches: Int!, pasajeros: Int!): Reserva!
  }
`)

// --- Funciones que arman los objetos que pide el esquema ---

const buscarDestino = (id) => {
  const d = destinos.find((x) => x.id === id)
  return { id: d.id, ciudad: d.ciudad, pais: d.pais }
}

const ahora = () => new Date().toISOString()

const aVuelo = (v) => ({
  ...v,
  consultadoEn: ahora(),
  origen: 'Santiago (SCL)',
  asientosDisponibles: v.asientos,
  disponible: v.asientos > 0,
  destino: buscarDestino(v.destinoId),
})

const aHotel = (h) => ({
  ...h,
  consultadoEn: ahora(),
  habitacionesDisponibles: h.habitaciones,
  disponible: h.habitaciones > 0,
  destino: buscarDestino(h.destinoId),
})

// Isla de Pascua responde con error a propósito, para mostrar cómo se manejan los errores de GraphQL
function validarDestino(destinoId) {
  if (!destinos.some((d) => d.id === destinoId)) {
    throw new Error(`El destino "${destinoId}" no existe`)
  }
  if (destinoId === 'isla-de-pascua') {
    throw new Error('El sistema de disponibilidad de vuelos y hoteles para Isla de Pascua no está respondiendo')
  }
}

// --- Resolvers: qué devuelve cada campo de Query y Mutation ---
export const resolvers = {
  disponibilidad: ({ destinoId }) => {
    validarDestino(destinoId)
    return {
      destinoId,
      consultadoEn: ahora(),
      vuelos: vuelos.filter((v) => v.destinoId === destinoId).map(aVuelo),
      hoteles: hoteles.filter((h) => h.destinoId === destinoId).map(aHotel),
    }
  },

  vuelos: ({ destinoId }) => {
    validarDestino(destinoId)
    return vuelos.filter((v) => v.destinoId === destinoId).map(aVuelo)
  },

  hoteles: ({ destinoId }) => {
    validarDestino(destinoId)
    return hoteles.filter((h) => h.destinoId === destinoId).map(aHotel)
  },

  vuelo: ({ id }) => {
    const v = vuelos.find((x) => x.id === id)
    return v ? aVuelo(v) : null
  },

  hotel: ({ id }) => {
    const h = hoteles.find((x) => x.id === id)
    return h ? aHotel(h) : null
  },

  crearReserva: ({ vueloId, hotelId, noches, pasajeros }) => {
    if (!vueloId && !hotelId) throw new Error('Debes elegir al menos un vuelo o un hotel')
    if (pasajeros < 1 || pasajeros > 9) throw new Error('La cantidad de pasajeros debe estar entre 1 y 9')
    if (noches < 1 || noches > 30) throw new Error('La cantidad de noches debe estar entre 1 y 30')

    const vuelo = vueloId ? vuelos.find((v) => v.id === vueloId) : null
    const hotel = hotelId ? hoteles.find((h) => h.id === hotelId) : null
    const habitaciones = Math.ceil(pasajeros / 2) // 2 personas por habitación

    if (vueloId && !vuelo) throw new Error('El vuelo seleccionado no existe')
    if (hotelId && !hotel) throw new Error('El hotel seleccionado no existe')
    if (vuelo && vuelo.asientos < pasajeros) {
      throw new Error(`El vuelo ${vuelo.numero} solo tiene ${vuelo.asientos} asientos disponibles`)
    }
    if (hotel && hotel.habitaciones < habitaciones) {
      throw new Error(`${hotel.nombre} solo tiene ${hotel.habitaciones} habitaciones disponibles`)
    }

    // Se descuenta la disponibilidad (queda así hasta recargar la página)
    if (vuelo) vuelo.asientos -= pasajeros
    if (hotel) hotel.habitaciones -= habitaciones

    const total =
      (vuelo ? vuelo.precio * pasajeros : 0) + (hotel ? hotel.precioNoche * noches * habitaciones : 0)

    return {
      codigo: 'VJ-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      vuelo: vuelo ? aVuelo(vuelo) : null,
      hotel: hotel ? aHotel(hotel) : null,
      noches,
      pasajeros,
      total,
    }
  },
}
