'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SENHA_MIN = 6

export function CadastroPage() {
  const { registrar } = useAuth()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (nome.trim().length < 2) {
      setErro('Informe seu nome completo.')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (senha.length < SENHA_MIN) {
      setErro(`A senha deve ter pelo menos ${SENHA_MIN} caracteres.`)
      return
    }

    setEnviando(true)
    try {
      await registrar({ nome: nome.trim(), email: email.trim(), senha })
      router.replace('/')
    } catch (err) {
      setErro(err.message || 'Não foi possível criar a conta.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">Crie sua conta</h1>
      <p className="auth-form__subtitle">Comece a registrar suas leituras</p>

      {erro && (
        <p className="auth-form__alert" role="alert">
          {erro}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-form__fields">
          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              className="input"
              type="text"
              autoComplete="name"
              placeholder="Ana Beatriz Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="ana@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <p className="auth-form__hint">Mínimo de {SENHA_MIN} caracteres.</p>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--block auth-form__submit"
          disabled={enviando}
        >
          {enviando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <hr className="auth-form__divider" />

      <p className="auth-form__switch">
        Já tem conta? <Link href="/entrar">Entre aqui</Link>
      </p>
    </div>
  )
}
