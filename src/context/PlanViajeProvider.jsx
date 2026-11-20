import { useEffect, useState } from 'react'
import { PlanViajeContext } from './PlanViajeContext'

const planVacio = { destino: null, vuelo: null, hotel: null, noches: 5, pasajeros: 2 }

function leerPlanGuardado() {
  try {
    return JSON.parse(localStorage.getItem('planViaje')) || planVacio
  } catch {
    return planVacio
  }
}

export default function PlanViajeProvider({ children }) {
  // el estado inicial se lee una sola vez desde localStorage
  const [plan, setPlan] = useState(leerPlanGuardado)

  // cada vez que cambia el plan, se guarda para no perderlo al recargar la página
  useEffect(() => {
    localStorage.setItem('planViaje', JSON.stringify(plan))
  }, [plan])

  // Si se elige algo de otro destino, el plan se reinicia para ese destino
  const elegir = (tipo, destino, opcion) => {
    setPlan((prev) => {
      const mismoDestino = prev.destino?.id === destino.id
      return {
        ...prev,
        destino,
        vuelo: mismoDestino ? prev.vuelo : null,
        hotel: mismoDestino ? prev.hotel : null,
        [tipo]: opcion,
      }
    })
  }

  const valor = {
    plan,
    elegirVuelo: (destino, vuelo) => elegir('vuelo', destino, vuelo),
    elegirHotel: (destino, hotel) => elegir('hotel', destino, hotel),
    quitar: (tipo) =>
      setPlan((prev) => {
        const nuevo = { ...prev, [tipo]: null }
        // si ya no queda nada elegido, también se quita el destino
        if (!nuevo.vuelo && !nuevo.hotel) nuevo.destino = null
        return nuevo
      }),
    cambiarNoches: (noches) => setPlan((prev) => ({ ...prev, noches })),
    cambiarPasajeros: (pasajeros) => setPlan((prev) => ({ ...prev, pasajeros })),
    limpiar: () => setPlan(planVacio),
  }

  return <PlanViajeContext.Provider value={valor}>{children}</PlanViajeContext.Provider>
}
