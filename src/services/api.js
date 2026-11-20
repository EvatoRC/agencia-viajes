// Capa de acceso a la API REST (mock).
//
// Guarda las respuestas en un "almacén" (store) fuera de React. Las vistas lo leen con
// useSyncExternalStore (ver hooks/useApi.js), así React se entera de cada cambio y
// siempre queda claro qué datos se muestran y de cuándo son.
//
// Política de la caché:
//  - FRESCO (5 min): mientras los datos tengan menos de 5 min, no se vuelve a consultar.
//  - Al vencer, se revalidan: al entrar a la vista, o con un temporizador si la vista sigue abierta.
//    Mientras se revalida se siguen mostrando los datos anteriores ("Actualizando...").
//  - Se descartan: las URLs que ninguna vista está usando y que tienen más de 30 min,
//    o las más antiguas cuando hay más de 30 guardadas. Un 404 descarta los datos de esa URL.

export const FRESCO = 5 * 60 * 1000
const MAX_ANTIGUEDAD = 30 * 60 * 1000
const MAX_ENTRADAS = 30
const TIMEOUT = 8000 // si el servidor demora más de 8 s, se corta la petición

// Estado de una URL. Cada cambio crea un objeto NUEVO (nunca se modifica el existente),
// así React puede comparar por referencia y saber si debe volver a renderizar.
const VACIO = Object.freeze({ datos: null, fecha: null, error: null, pidiendo: false, origen: null })

const almacen = new Map() // url -> estado
const enUso = new Map() // url -> cantidad de vistas que la están mostrando
const oyentes = new Set()

// Error propio para saber qué tipo de problema ocurrió y mostrar un mensaje claro
export class ErrorApi extends Error {
  constructor(tipo, mensaje, status = null) {
    super(mensaje)
    // 'no-encontrado' | 'servidor' | 'formato' | 'timeout' | 'red' | 'solicitud'
    this.tipo = tipo
    this.status = status
  }
}

// ---------- Suscripción (para useSyncExternalStore) ----------

export function suscribir(oyente) {
  oyentes.add(oyente)
  return () => oyentes.delete(oyente)
}

// Lectura pura: no consulta la hora ni modifica nada
export function leerEstado(url) {
  return almacen.get(url) ?? VACIO
}

function cambiar(url, cambios) {
  almacen.set(url, { ...leerEstado(url), ...cambios })
  oyentes.forEach((oyente) => oyente())
}

// Una vista avisa que está mostrando una URL; devuelve la función para dejar de usarla
export function usarUrl(url) {
  enUso.set(url, (enUso.get(url) ?? 0) + 1)
  return () => {
    enUso.set(url, enUso.get(url) - 1)
    if (enUso.get(url) === 0) enUso.delete(url)
  }
}

// Expulsión: solo se descartan URLs que ninguna vista está usando
function limpiar() {
  const ahora = Date.now()
  const libres = [...almacen.entries()].filter(([url, e]) => !enUso.has(url) && !e.pidiendo)

  libres
    .filter(([, e]) => !e.fecha || ahora - e.fecha > MAX_ANTIGUEDAD)
    .forEach(([url]) => almacen.delete(url))

  const sobrantes = almacen.size - MAX_ENTRADAS
  if (sobrantes > 0) {
    libres
      .filter(([url]) => almacen.has(url))
      .sort(([, a], [, b]) => (a.fecha ?? 0) - (b.fecha ?? 0)) // las más antiguas primero
      .slice(0, sobrantes)
      .forEach(([url]) => almacen.delete(url))
  }
}

// ---------- Petición HTTP ----------

async function pedir(url) {
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT)

  try {
    const res = await fetch(url, { signal: controlador.signal })

    if (!res.ok) {
      // El mock manda { mensaje } en el cuerpo; si no viene o no se puede leer, uso uno genérico
      const cuerpo = await res.json().catch(() => ({}))
      const detalle = cuerpo.mensaje || res.statusText || `Error ${res.status}`

      if (res.status === 404) throw new ErrorApi('no-encontrado', detalle, 404)
      if (res.status >= 500) throw new ErrorApi('servidor', detalle, res.status)
      throw new ErrorApi('solicitud', detalle, res.status)
    }

    // La respuesta llegó (hay conexión), pero su contenido podría no ser JSON válido
    try {
      return await res.json()
    } catch (err) {
      if (err.name === 'AbortError') throw err
      throw new ErrorApi(
        'formato',
        'El servidor respondió, pero los datos llegaron en un formato que no se pudo leer',
        res.status
      )
    }
  } catch (err) {
    if (err instanceof ErrorApi) throw err
    if (err.name === 'AbortError') {
      throw new ErrorApi('timeout', 'El servidor tardó demasiado en responder')
    }
    // fetch solo lanza TypeError cuando no hay conexión o el servidor no responde
    throw new ErrorApi('red', 'No se pudo conectar con el servidor')
  } finally {
    clearTimeout(temporizador)
  }
}

// ---------- Respaldo en localStorage ----------

function leerRespaldo(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave))
  } catch {
    return null
  }
}

function guardarRespaldo(clave, datos, fecha) {
  try {
    localStorage.setItem(clave, JSON.stringify({ datos, fecha }))
  } catch {
    // sin espacio o almacenamiento bloqueado: el respaldo es opcional
  }
}

// ---------- Consulta ----------

// Pide la URL y actualiza el almacén. Si ya hay una petición en curso para la misma URL,
// no hace otra (varias vistas pueden pedir lo mismo a la vez).
// "respaldo" = clave de localStorage donde se guarda la última respuesta correcta.
export function revalidar(url, { respaldo = null } = {}) {
  if (leerEstado(url).pidiendo) return

  cambiar(url, { pidiendo: true })

  pedir(url)
    .then((datos) => {
      const fecha = Date.now()
      cambiar(url, { datos, fecha, error: null, pidiendo: false, origen: 'api' })
      if (respaldo) guardarRespaldo(respaldo, datos, fecha)
    })
    .catch((error) => {
      const cambios = { error, pidiendo: false }

      if (error.tipo === 'no-encontrado') {
        // el recurso ya no existe: lo guardado de esa URL deja de ser válido
        Object.assign(cambios, { datos: null, fecha: null, origen: null })
      } else if (!leerEstado(url).datos && respaldo) {
        // no hay nada en memoria: se usa la última copia guardada (con su fecha)
        const guardado = leerRespaldo(respaldo)
        if (guardado) Object.assign(cambios, { datos: guardado.datos, fecha: guardado.fecha, origen: 'respaldo' })
      }
      // en otro caso se conservan los datos anteriores, con su fecha original

      cambiar(url, cambios)
    })
    .finally(limpiar)
}

// --- Endpoints REST ---
export const urls = {
  // "simular" agrega ?simular=404|500|json para probar errores del mock
  destinos: (simular = '') => (simular ? `/api/destinos?simular=${simular}` : '/api/destinos'),
  destino: (id) => `/api/destinos/${encodeURIComponent(id)}`,
}
