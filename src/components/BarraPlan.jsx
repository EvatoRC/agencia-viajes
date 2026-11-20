import { Link } from 'react-router'
import { usePlanViaje } from '../hooks/usePlanViaje'

// Barra fija abajo que resume lo elegido para el destino actual
export default function BarraPlan({ destinoId }) {
  const { plan } = usePlanViaje()
  if (plan.destino?.id !== destinoId || (!plan.vuelo && !plan.hotel)) return null

  return (
    <div className="barra-plan" role="status">
      <span>
        Tu viaje a <strong>{plan.destino.ciudad}</strong>: {plan.vuelo ? '✈️ vuelo elegido' : '✈️ falta vuelo'} ·{' '}
        {plan.hotel ? '🏨 hotel elegido' : '🏨 falta hotel'}
      </span>
      <Link to="/mi-viaje" className="btn btn-chico">
        Ver mi viaje →
      </Link>
    </div>
  )
}
