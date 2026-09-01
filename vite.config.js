import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// A API do EntreCapitulos roda em http://localhost:3000 e não habilita CORS.
// O proxy de desenvolvimento evita problemas de CORS: o front chama /api/...
// e o Vite encaminha para a API removendo o prefixo /api.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
