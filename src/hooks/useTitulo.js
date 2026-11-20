import { useEffect } from 'react'

// Cambia el título de la pestaña del navegador según la vista
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Rumbo Viajes` : 'Rumbo Viajes'
  }, [titulo])
}
