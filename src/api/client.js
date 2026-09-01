// Cliente HTTP para a API do EntreCapitulos.
// Em desenvolvimento o Vite faz proxy de /api -> http://localhost:3000 (ver vite.config.js).

// Em desenvolvimento usamos o proxy do Vite (/api). Defina VITE_API_BASE
// para apontar direto para a API (ex.: build servido separadamente).
const BASE_URL = import.meta.env.VITE_API_BASE || '/api'
const TOKEN_KEY = 'ec_token'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignora indisponibilidade de storage */
  }
}

/**
 * Executa uma requisição à API.
 * @param {string} path caminho iniciando com "/" (ex.: "/livros")
 * @param {{ method?: string, body?: unknown, auth?: boolean, signal?: AbortSignal }} [options]
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, auth = true, signal } = options
  const headers = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o servidor está rodando.',
      0,
      null,
    )
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message = data?.mensagem || data?.message || 'Erro ao processar a requisição.'
    throw new ApiError(message, response.status, data)
  }

  return data
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
