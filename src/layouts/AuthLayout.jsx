import { Outlet } from 'react-router-dom'
import './auth.css'

// Shell das telas públicas: painel da marca à esquerda + formulário à direita,
// conforme o protótipo.

export function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__brand">
        <span className="auth__brand-ring" aria-hidden="true" />

        <div className="auth__logo">
          <span className="auth__logo-1">Entre</span>
          <span className="auth__logo-2">Capítulos</span>
        </div>
        <p className="auth__tagline">Sua jornada literária</p>

        <hr className="auth__rule" />

        <blockquote className="auth__quote">
          “Um leitor vive mil vidas antes de morrer. Quem nunca lê, vive apenas uma.”
          <span className="auth__quote-author">— George R.R. Martin</span>
        </blockquote>

        <hr className="auth__rule" />

        <p className="auth__brand-footer">
          Registre o que leu, descubra o próximo, veja o que seus amigos estão lendo.
        </p>
      </aside>

      <main className="auth__panel">
        <Outlet />
      </main>
    </div>
  )
}
