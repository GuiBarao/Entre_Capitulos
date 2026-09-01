import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getToken, setToken } from '../api/client'
import { auth as authApi, usuarios as usuariosApi } from '../api/resources'
import { decodeJwt, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    const stored = getToken()
    return stored && !isTokenExpired(stored) ? stored : null
  })
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(Boolean(token))

  const usuarioId = useMemo(() => decodeJwt(token)?.id ?? null, [token])

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setUsuario(null)
    setCarregando(false)
  }, [])

  // Sincroniza o token com o armazenamento e carrega o usuário logado.
  useEffect(() => {
    if (!token) {
      setToken(null)
      return
    }

    if (isTokenExpired(token)) {
      logout()
      return
    }

    setToken(token)
    let ativo = true
    setCarregando(true)

    usuariosApi
      .buscar(usuarioId)
      .then((dados) => {
        if (ativo) setUsuario(dados)
      })
      .catch(() => {
        if (ativo) logout()
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [token, usuarioId, logout])

  const login = useCallback(async (email, senha) => {
    const { token: novoToken } = await authApi.login(email, senha)
    setToken(novoToken)
    setTokenState(novoToken)
    return novoToken
  }, [])

  const registrar = useCallback(
    async (dados) => {
      await authApi.registrar(dados)
      return login(dados.email, dados.senha)
    },
    [login],
  )

  const atualizarUsuario = useCallback(
    async (dados) => {
      const atualizado = await usuariosApi.atualizar(usuarioId, dados)
      setUsuario(atualizado)
      return atualizado
    },
    [usuarioId],
  )

  const value = useMemo(
    () => ({
      token,
      usuario,
      usuarioId,
      autenticado: Boolean(token),
      carregando,
      login,
      registrar,
      logout,
      atualizarUsuario,
      setUsuario,
    }),
    [token, usuario, usuarioId, carregando, login, registrar, logout, atualizarUsuario],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
