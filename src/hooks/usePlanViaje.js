import { useContext } from 'react'
import { PlanViajeContext } from '../context/PlanViajeContext'

export function usePlanViaje() {
  const contexto = useContext(PlanViajeContext)
  if (!contexto) throw new Error('usePlanViaje debe usarse dentro de <PlanViajeProvider>')
  return contexto
}
