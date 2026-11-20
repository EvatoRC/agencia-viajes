import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // rutas relativas: el build funciona en GitHub Pages sin importar el nombre del repositorio
  base: './',
  // el mock incluye la librería graphql (~400 kB); se sube el límite para que no avise en cada build
  build: { chunkSizeWarningLimit: 900 },
})
