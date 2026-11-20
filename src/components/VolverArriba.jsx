import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Al cambiar de ruta, la nueva vista parte desde arriba (React Router no lo hace solo)
export default function VolverArriba() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
