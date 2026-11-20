import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { FRESCO } from '../services/api'

// useQuery de Apollo + la misma política de vigencia que la parte REST:
//  - Apollo guarda la respuesta en su caché; al volver a la vista no se repite la consulta.
//  - "fechaDe" saca de la respuesta la hora en que el servidor entregó los datos (consultadoEn).
//    Como esa hora viene dentro de los datos, el render no depende de nada externo.
//  - Si al entrar los datos tienen más de 5 min, o la vista sigue abierta cuando los cumplen,
//    se vuelve a consultar (refetch) mostrando mientras tanto los datos anteriores.
export function useConsultaVigente(consulta, { variables, fechaDe }) {
  const resultado = useQuery(consulta, {
    variables,
    notifyOnNetworkStatusChange: true, // para saber cuándo se está reconsultando
  })
  const { data, loading, error, refetch } = resultado
  const consultadoEn = data ? fechaDe(data) : null
  const fecha = consultadoEn ? Date.parse(consultadoEn) : null

  useEffect(() => {
    // sin datos, consultando o con error no se programa nada (con error se espera "Reintentar")
    if (!fecha || loading || error) return
    const restante = fecha + FRESCO - Date.now()
    const temporizador = setTimeout(() => {
      refetch().catch(() => {}) // el error queda en "error" de useQuery y se muestra en la vista
    }, Math.max(restante, 0))
    return () => clearTimeout(temporizador)
  }, [fecha, loading, error, refetch])

  return {
    ...resultado,
    fecha,
    cargando: loading && !data,
    actualizando: loading && !!data,
    reintentar: () => refetch().catch(() => {}),
  }
}
