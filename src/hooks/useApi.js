import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { FRESCO, leerEstado, revalidar, suscribir, usarUrl } from '../services/api'

// Hook para consumir un endpoint GET de la API REST.
//
// Los datos viven en el almacén de services/api.js y se leen con useSyncExternalStore:
// cada vez que el almacén cambia (llega una respuesta, empieza o termina una petición),
// React vuelve a renderizar la vista con el estado nuevo.
//
// Devuelve:
//  datos        -> lo que se muestra (puede venir de la API o del respaldo)
//  fecha        -> cuándo se obtuvieron esos datos (timestamp)
//  origen       -> 'api' o 'respaldo'
//  cargando     -> todavía no hay nada que mostrar y no hubo error
//  actualizando -> hay una petición en curso, pero se siguen mostrando los datos anteriores
//  error        -> el último intento falló (puede haber datos anteriores igual)
//  reintentar   -> hace una petición nueva
export function useApi(url, { respaldo = null } = {}) {
  const estado = useSyncExternalStore(suscribir, () => leerEstado(url))
  const { datos, fecha, error, pidiendo, origen } = estado

  // Mientras la vista esté abierta, el almacén no descarta esta URL
  useEffect(() => usarUrl(url), [url])

  // Al entrar a la vista: se consulta si no hay datos, si están vencidos o si el último intento falló
  useEffect(() => {
    const actual = leerEstado(url)
    const vencido = !actual.fecha || Date.now() - actual.fecha >= FRESCO
    if (vencido || actual.error) revalidar(url, { respaldo })
  }, [url, respaldo])

  // Si la vista sigue abierta, se revalida justo cuando los datos cumplen 5 minutos.
  // No se programa si hay error: en ese caso se espera a que la persona pulse "Reintentar".
  useEffect(() => {
    if (!fecha || pidiendo || error) return
    const restante = fecha + FRESCO - Date.now()
    const temporizador = setTimeout(() => revalidar(url, { respaldo }), Math.max(restante, 0))
    return () => clearTimeout(temporizador)
  }, [url, fecha, pidiendo, error, respaldo])

  const reintentar = useCallback(() => revalidar(url, { respaldo }), [url, respaldo])

  return {
    datos,
    fecha,
    origen,
    error,
    // sin datos ni error = la petición está por empezar (evita un render en blanco)
    cargando: !datos && (pidiendo || !error),
    actualizando: pidiendo && !!datos,
    reintentar,
  }
}
