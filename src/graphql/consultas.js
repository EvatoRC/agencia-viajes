import { gql } from '@apollo/client'

// Listado de vuelos y hoteles de un destino: UNA sola petición trae las dos listas,
// y solo con los campos que necesitan las tarjetas. "consultadoEn" es la hora en que el
// servidor entregó los datos: con ella se sabe cuándo hay que volver a consultar.
export const OPCIONES_DESTINO = gql`
  query OpcionesDestino($destinoId: ID!) {
    disponibilidad(destinoId: $destinoId) {
      destinoId
      consultadoEn
      vuelos {
        id
        aerolinea
        numero
        salida
        llegada
        escalas
        precio
        asientosDisponibles
        disponible
      }
      hoteles {
        id
        nombre
        estrellas
        barrio
        precioNoche
        habitacionesDisponibles
        disponible
      }
    }
  }
`

// Detalle de un vuelo: pide los campos extra que no se muestran en la tarjeta
export const DETALLE_VUELO = gql`
  query DetalleVuelo($id: ID!) {
    vuelo(id: $id) {
      id
      aerolinea
      numero
      origen
      salida
      llegada
      escalas
      clase
      equipaje
      precio
      asientosDisponibles
      disponible
      consultadoEn
      destino {
        id
        ciudad
        pais
      }
    }
  }
`

// Detalle de un hotel
export const DETALLE_HOTEL = gql`
  query DetalleHotel($id: ID!) {
    hotel(id: $id) {
      id
      nombre
      estrellas
      barrio
      descripcion
      servicios
      precioNoche
      habitacionesDisponibles
      disponible
      disponibleDesde
      disponibleHasta
      consultadoEn
      destino {
        id
        ciudad
        pais
      }
    }
  }
`

// Reserva del plan de viaje. Devuelve el vuelo y el hotel con su nueva disponibilidad:
// Apollo actualiza su caché con esos datos y las listas muestran los cupos descontados.
export const CREAR_RESERVA = gql`
  mutation CrearReserva($vueloId: ID, $hotelId: ID, $noches: Int!, $pasajeros: Int!) {
    crearReserva(vueloId: $vueloId, hotelId: $hotelId, noches: $noches, pasajeros: $pasajeros) {
      codigo
      noches
      pasajeros
      total
      vuelo {
        id
        asientosDisponibles
        disponible
      }
      hotel {
        id
        habitacionesDisponibles
        disponible
      }
    }
  }
`
