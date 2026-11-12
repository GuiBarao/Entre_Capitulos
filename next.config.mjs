// Endereço da API do EntreCapitulos (back-end Express).
const API_URL = process.env.API_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // O front chama /api/... e o Next repassa para a API removendo o prefixo
  // (ex.: /api/livros -> http://localhost:3000/livros). Como para o navegador
  // tudo sai da mesma origem, não é preciso habilitar CORS na API.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
