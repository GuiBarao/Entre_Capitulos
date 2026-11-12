// Versão "somente telas": não há back-end. Este módulo guarda apenas o
// pseudo-token da sessão (localStorage) e o tipo de erro usado pela
// camada de dados falsa (src/api/resources.js).

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
