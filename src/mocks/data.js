// Datos simulados del "backend". En un proyecto real vendrían de una base de datos.
// Precios en pesos chilenos (CLP). Todos los vuelos salen desde Santiago (SCL).

export const destinos = [
  {
    id: 'cusco', ciudad: 'Cusco', pais: 'Perú', region: 'Sudamérica', icono: '🏔️', color: '#b5562d',
    descripcion: 'La antigua capital del imperio inca y puerta de entrada a Machu Picchu.',
    actividades: ['Machu Picchu', 'Valle Sagrado', 'Montaña de Colores', 'Barrio de San Blas'],
  },
  {
    id: 'buenos-aires', ciudad: 'Buenos Aires', pais: 'Argentina', region: 'Sudamérica', icono: '💃', color: '#3d6fb4',
    descripcion: 'Ciudad de tango, cafés históricos y una vida cultural que no se detiene.',
    actividades: ['Show de tango', 'Caminito en La Boca', 'Teatro Colón', 'Recoleta'],
  },
  {
    id: 'rio-de-janeiro', ciudad: 'Río de Janeiro', pais: 'Brasil', region: 'Sudamérica', icono: '🏖️', color: '#2e8b6a',
    descripcion: 'Playas famosas, morros y la vista desde el Cristo Redentor.',
    actividades: ['Cristo Redentor', 'Pan de Azúcar', 'Playa de Copacabana', 'Escalera Selarón'],
  },
  {
    id: 'cancun', ciudad: 'Cancún', pais: 'México', region: 'Norteamérica', icono: '🌴', color: '#1f9bb5',
    descripcion: 'Mar turquesa del Caribe, cenotes y ruinas mayas a pocas horas.',
    actividades: ['Chichén Itzá', 'Nado en cenotes', 'Isla Mujeres', 'Snorkel en arrecifes'],
  },
  {
    id: 'nueva-york', ciudad: 'Nueva York', pais: 'Estados Unidos', region: 'Norteamérica', icono: '🗽', color: '#4a4f6a',
    descripcion: 'Rascacielos, museos de primer nivel y barrios con personalidad propia.',
    actividades: ['Central Park', 'Estatua de la Libertad', 'Broadway', 'Museo Metropolitano'],
  },
  {
    id: 'madrid', ciudad: 'Madrid', pais: 'España', region: 'Europa', icono: '🏛️', color: '#a83f4a',
    descripcion: 'Capital de museos, plazas animadas y comida para compartir.',
    actividades: ['Museo del Prado', 'Parque del Retiro', 'Palacio Real', 'Ruta de tapas'],
  },
  {
    id: 'roma', ciudad: 'Roma', pais: 'Italia', region: 'Europa', icono: '🛵', color: '#c08a2e',
    descripcion: 'Dos mil años de historia en cada esquina, y el mejor gelato.',
    actividades: ['Coliseo', 'Fontana di Trevi', 'Museos Vaticanos', 'Trastevere'],
  },
  {
    id: 'tokio', ciudad: 'Tokio', pais: 'Japón', region: 'Asia', icono: '🗼', color: '#6a4c93',
    descripcion: 'Tradición y tecnología conviven en la ciudad más grande del mundo.',
    actividades: ['Templo Senso-ji', 'Cruce de Shibuya', 'Monte Fuji', 'Mercado de Tsukiji'],
  },
  {
    id: 'isla-de-pascua', ciudad: 'Isla de Pascua', pais: 'Chile', region: 'Oceanía', icono: '🗿', color: '#5b7f3a',
    descripcion: 'Rapa Nui: moáis, volcanes y atardeceres en medio del Pacífico.',
    actividades: ['Ahu Tongariki', 'Volcán Rano Kau', 'Playa Anakena', 'Tapati Rapa Nui'],
  },
]

// Vuelos ida desde Santiago. "asientos" = asientos libres (0 = sin disponibilidad)
export const vuelos = [
  { id: 'V101', destinoId: 'cusco', aerolinea: 'LATAM', numero: 'LA2045', salida: '2026-12-12T07:30', llegada: '2026-12-12T11:05', escalas: 1, clase: 'Económica', equipaje: 'Bolso de mano 8 kg', precio: 289000, asientos: 14 },
  { id: 'V102', destinoId: 'cusco', aerolinea: 'Sky Airline', numero: 'H2 541', salida: '2026-12-19T06:10', llegada: '2026-12-19T10:20', escalas: 1, clase: 'Económica', equipaje: 'Bolso de mano 10 kg', precio: 245000, asientos: 3 },
  { id: 'V103', destinoId: 'cusco', aerolinea: 'JetSMART', numero: 'JA 312', salida: '2027-01-08T05:45', llegada: '2027-01-08T10:30', escalas: 1, clase: 'Económica', equipaje: 'Artículo personal', precio: 198000, asientos: 0 },

  { id: 'V201', destinoId: 'buenos-aires', aerolinea: 'Aerolíneas Argentinas', numero: 'AR 1285', salida: '2026-12-05T09:00', llegada: '2026-12-05T11:05', escalas: 0, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 189000, asientos: 22 },
  { id: 'V202', destinoId: 'buenos-aires', aerolinea: 'JetSMART', numero: 'JA 701', salida: '2026-12-05T14:20', llegada: '2026-12-05T16:25', escalas: 0, clase: 'Económica', equipaje: 'Artículo personal', precio: 119000, asientos: 9 },
  { id: 'V203', destinoId: 'buenos-aires', aerolinea: 'LATAM', numero: 'LA 445', salida: '2026-12-18T19:40', llegada: '2026-12-18T21:45', escalas: 0, clase: 'Premium Economy', equipaje: 'Maleta 23 kg', precio: 342000, asientos: 5 },

  { id: 'V301', destinoId: 'rio-de-janeiro', aerolinea: 'LATAM', numero: 'LA 750', salida: '2027-01-15T08:15', llegada: '2027-01-15T13:05', escalas: 0, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 398000, asientos: 11 },
  { id: 'V302', destinoId: 'rio-de-janeiro', aerolinea: 'GOL', numero: 'G3 7731', salida: '2027-01-22T11:30', llegada: '2027-01-22T18:45', escalas: 1, clase: 'Económica', equipaje: 'Bolso de mano 10 kg', precio: 315000, asientos: 0 },

  { id: 'V401', destinoId: 'cancun', aerolinea: 'Copa Airlines', numero: 'CM 286', salida: '2027-02-03T23:55', llegada: '2027-02-04T09:40', escalas: 1, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 612000, asientos: 7 },
  { id: 'V402', destinoId: 'cancun', aerolinea: 'Aeroméxico', numero: 'AM 9', salida: '2027-02-10T00:30', llegada: '2027-02-10T10:55', escalas: 1, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 589000, asientos: 2 },

  { id: 'V501', destinoId: 'nueva-york', aerolinea: 'American Airlines', numero: 'AA 940', salida: '2026-12-20T21:30', llegada: '2026-12-21T07:05', escalas: 0, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 845000, asientos: 16 },
  { id: 'V502', destinoId: 'nueva-york', aerolinea: 'LATAM', numero: 'LA 532', salida: '2026-12-22T22:10', llegada: '2026-12-23T07:40', escalas: 0, clase: 'Business', equipaje: '2 maletas 32 kg', precio: 2890000, asientos: 4 },

  { id: 'V601', destinoId: 'madrid', aerolinea: 'Iberia', numero: 'IB 6830', salida: '2027-01-10T12:45', llegada: '2027-01-11T06:30', escalas: 0, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 965000, asientos: 19 },
  { id: 'V602', destinoId: 'madrid', aerolinea: 'LATAM', numero: 'LA 704', salida: '2027-01-17T13:20', llegada: '2027-01-18T07:15', escalas: 0, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 1029000, asientos: 6 },

  { id: 'V701', destinoId: 'roma', aerolinea: 'ITA Airways', numero: 'AZ 681', salida: '2027-02-14T15:00', llegada: '2027-02-15T14:20', escalas: 1, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 1120000, asientos: 8 },

  { id: 'V801', destinoId: 'tokio', aerolinea: 'Qatar Airways', numero: 'QR 774', salida: '2027-03-02T01:15', llegada: '2027-03-04T06:50', escalas: 2, clase: 'Económica', equipaje: '2 maletas 23 kg', precio: 1690000, asientos: 0 },
  { id: 'V802', destinoId: 'tokio', aerolinea: 'Air Canada', numero: 'AC 93', salida: '2027-03-09T09:40', llegada: '2027-03-10T16:15', escalas: 1, clase: 'Económica', equipaje: 'Maleta 23 kg', precio: 1540000, asientos: 0 },
]

// Hoteles. "habitaciones" = habitaciones libres (0 = sin disponibilidad)
export const hoteles = [
  { id: 'H101', destinoId: 'cusco', nombre: 'Casa Andina San Blas', estrellas: 3, barrio: 'San Blas', precioNoche: 68000, habitaciones: 6,
    disponibleDesde: '2026-12-01', disponibleHasta: '2027-03-31', servicios: ['Desayuno incluido', 'Wifi', 'Oxígeno para la altura'],
    descripcion: 'Casona colonial a pasos de la Plaza de Armas, con patio interior y vista a los techos de teja.' },
  { id: 'H102', destinoId: 'cusco', nombre: 'Inkaterra Valle', estrellas: 5, barrio: 'Valle Sagrado', precioNoche: 245000, habitaciones: 2,
    disponibleDesde: '2026-12-10', disponibleHasta: '2027-02-28', servicios: ['Spa', 'Restaurante', 'Traslado a la estación de tren'],
    descripcion: 'Lodge rodeado de jardines en el Valle Sagrado, ideal antes de subir a Machu Picchu.' },

  { id: 'H201', destinoId: 'buenos-aires', nombre: 'Palermo Soho Boutique', estrellas: 4, barrio: 'Palermo', precioNoche: 92000, habitaciones: 8,
    disponibleDesde: '2026-12-01', disponibleHasta: '2027-03-31', servicios: ['Desayuno incluido', 'Terraza', 'Wifi'],
    descripcion: 'Hotel pequeño en una calle arbolada, rodeado de cafés, tiendas de diseño y restaurantes.' },
  { id: 'H202', destinoId: 'buenos-aires', nombre: 'Gran Hotel Recoleta', estrellas: 5, barrio: 'Recoleta', precioNoche: 178000, habitaciones: 0,
    disponibleDesde: '2027-01-05', disponibleHasta: '2027-03-31', servicios: ['Piscina', 'Gimnasio', 'Restaurante'],
    descripcion: 'Edificio de estilo francés frente a la plaza, a una cuadra del cementerio de la Recoleta.' },

  { id: 'H301', destinoId: 'rio-de-janeiro', nombre: 'Copacabana Mar', estrellas: 4, barrio: 'Copacabana', precioNoche: 134000, habitaciones: 5,
    disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-15', servicios: ['Frente a la playa', 'Piscina en la azotea', 'Desayuno incluido'],
    descripcion: 'Habitaciones con balcón hacia la avenida Atlántica y la playa.' },
  { id: 'H302', destinoId: 'rio-de-janeiro', nombre: 'Pousada Santa Teresa', estrellas: 3, barrio: 'Santa Teresa', precioNoche: 71000, habitaciones: 3,
    disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-31', servicios: ['Jardín', 'Wifi', 'Desayuno incluido'],
    descripcion: 'Casa antigua en el barrio bohemio de los tranvías, con vista a la bahía.' },

  { id: 'H401', destinoId: 'cancun', nombre: 'Riviera All Inclusive', estrellas: 5, barrio: 'Zona Hotelera', precioNoche: 298000, habitaciones: 10,
    disponibleDesde: '2027-01-15', disponibleHasta: '2027-04-30', servicios: ['Todo incluido', 'Playa privada', 'Kids club'],
    descripcion: 'Resort frente al mar con piscinas, cinco restaurantes y actividades durante el día.' },
  { id: 'H402', destinoId: 'cancun', nombre: 'Hostal Centro Cancún', estrellas: 2, barrio: 'Centro', precioNoche: 38000, habitaciones: 12,
    disponibleDesde: '2026-12-01', disponibleHasta: '2027-04-30', servicios: ['Wifi', 'Cocina compartida'],
    descripcion: 'Opción económica cerca del terminal de buses, con transporte directo a las playas.' },

  { id: 'H501', destinoId: 'nueva-york', nombre: 'Midtown Lofts', estrellas: 4, barrio: 'Manhattan', precioNoche: 289000, habitaciones: 4,
    disponibleDesde: '2026-12-15', disponibleHasta: '2027-01-31', servicios: ['Gimnasio', 'Wifi', 'Recepción 24 h'],
    descripcion: 'A pocas cuadras de Times Square y Central Park.' },

  { id: 'H601', destinoId: 'madrid', nombre: 'Hostal Gran Vía', estrellas: 3, barrio: 'Centro', precioNoche: 84000, habitaciones: 7,
    disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-31', servicios: ['Wifi', 'Aire acondicionado'],
    descripcion: 'Habitaciones sencillas en plena Gran Vía, cerca de Sol y del Palacio Real.' },
  { id: 'H602', destinoId: 'madrid', nombre: 'Palacio del Retiro', estrellas: 5, barrio: 'Retiro', precioNoche: 312000, habitaciones: 3,
    disponibleDesde: '2027-01-01', disponibleHasta: '2027-03-31', servicios: ['Spa', 'Restaurante', 'Vista al parque'],
    descripcion: 'Edificio histórico frente al Parque del Retiro y a pasos del Museo del Prado.' },

  { id: 'H701', destinoId: 'roma', nombre: 'Albergo Trastevere', estrellas: 3, barrio: 'Trastevere', precioNoche: 97000, habitaciones: 5,
    disponibleDesde: '2027-02-01', disponibleHasta: '2027-04-30', servicios: ['Desayuno incluido', 'Wifi'],
    descripcion: 'Pequeño hotel familiar entre callejones empedrados y trattorias.' },

  { id: 'H801', destinoId: 'tokio', nombre: 'Shinjuku Capsule', estrellas: 2, barrio: 'Shinjuku', precioNoche: 41000, habitaciones: 0,
    disponibleDesde: '2027-03-01', disponibleHasta: '2027-04-30', servicios: ['Onsen', 'Casilleros', 'Wifi'],
    descripcion: 'Hotel cápsula moderno, a cinco minutos de la estación de Shinjuku.' },
]
