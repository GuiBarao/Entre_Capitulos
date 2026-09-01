import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EntrarPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarAjudaSenha, setMostrarAjudaSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!EMAIL_RE.test(email)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (!senha) {
      setErro('Informe sua senha.')
      return
    }

    setEnviando(true)
    try {
      await login(email.trim(), senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err.message || 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">Bem-vindo de volta</h1>
      <p className="auth-form__subtitle">Continue sua jornada literária</p>

      {erro && (
        <p className="auth-form__alert" role="alert">
          {erro}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-form__fields">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="ana@exemplo.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <div className="auth-form__label-row">
              <label htmlFor="senha">Senha</label>
              <button
                type="button"
                className="auth-form__forgot"
                onClick={() => setMostrarAjudaSenha((v) => !v)}
              >
                Esqueci a senha
              </button>
            </div>
            <input
              id="senha"
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {mostrarAjudaSenha && (
              <p className="auth-form__hint">
                A recuperação de senha ainda não está disponível. Entre em contato com o
                suporte para redefinir seu acesso.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--block auth-form__submit"
          disabled={enviando}
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <hr className="auth-form__divider" />

      <p className="auth-form__switch">
        Não tem conta? <Link to="/cadastro">Criar conta grátis</Link>
      </p>
    </div>
  )
}
