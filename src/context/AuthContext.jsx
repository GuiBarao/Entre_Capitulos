'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getToken, setToken } from '../api/client'
import { auth as authApi, usuarios as usuariosApi } from '../api/resources'
import { decodeJwt, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // O Next renderiza primeiro no servidor, onde não existe localStorage.
  // Por isso o token só é lido depois de montar no navegador (evita
  // diferença de hidratação); até lá a sessão fica "carregando".
  const [token, setTokenState] = useState(null)
  const [hidratado, setHidratado] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const stored = getToken()
    setTokenState(stored && !isTokenExpired(stored) ? stored : null)
    setHidratado(true)
  }, [])

  const usuarioId = useMemo(() => decodeJwt(token)?.id ?? null, [token])

  const logout = useCallback(() => {
    setToken(null)
    setTokenState(null)
    setUsuario(null)
    setCarregando(false)
  }, [])

  // Sincroniza o token com o armazenamento e carrega o usuário logado.
  useEffect(() => {
    if (!hidratado) return

    if (!token) {
      setToken(null)
      setCarregando(false)
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
  }, [hidratado, token, usuarioId, logout])

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

  const excluirConta = useCallback(async () => {
    await usuariosApi.excluir(usuarioId)
    logout()
  }, [usuarioId, logout])

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
      excluirConta,
      setUsuario,
    }),
    [
      token,
      usuario,
      usuarioId,
      carregando,
      login,
      registrar,
      logout,
      atualizarUsuario,
      excluirConta,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
