import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// A API do EntreCapitulos roda em http://localhost:3000 e não habilita CORS.
// O proxy de desenvolvimento evita problemas de CORS: o front chama /api/...
// e o Vite encaminha para a API (VITE_API_URL) removendo o prefixo /api.
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
