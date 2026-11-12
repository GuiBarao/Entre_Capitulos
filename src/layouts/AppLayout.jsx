'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useEstanteUsuario } from '../hooks/useEstanteUsuario'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import './app-layout.css'

const NAV = [
  { to: '/', rotulo: 'Início', icone: 'home', end: true },
  { to: '/explorar', rotulo: 'Explorar', icone: 'search' },
  { to: '/estante', rotulo: 'Minha Estante', icone: 'book-open' },
  { to: '/listas', rotulo: 'Minhas Listas', icone: 'list' },
  { to: '/perfil', rotulo: 'Meu Perfil', icone: 'user' },
]

function estaAtivo(pathname, to, end) {
  if (end) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AppLayout({ children }) {
  const pathname = usePathname()
  const { usuario, logout, ehAdmin } = useAuth()
  const { itens } = useEstanteUsuario(usuario?._id)

  const lidos = useMemo(
    () => itens.filter((e) => e.status === 'lido').length,
    [itens],
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__logo">
          <span className="sidebar__logo-1">Entre</span>
          <span className="sidebar__logo-2">Capítulos</span>
        </div>
        <p className="sidebar__tagline">Sua jornada literária</p>

        <hr className="sidebar__divider" />

        <nav className="sidebar__nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`sidebar__link${estaAtivo(pathname, item.to, item.end) ? ' is-active' : ''}`}
            >
              <Icon name={item.icone} size={17} />
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <div className="sidebar__spacer" />

        <Link href="/perfil" className="sidebar__user">
          <Avatar usuario={usuario} size={40} />
          <span>
            <span className="sidebar__user-name">{usuario?.nome || 'Meu perfil'}</span>
            <br />
            <span className="sidebar__user-meta">
              {ehAdmin ? 'Administrador · ' : ''}
              {lidos} {lidos === 1 ? 'livro lido' : 'livros lidos'}
            </span>
          </span>
        </Link>

        <button type="button" className="btn btn--ghost sidebar__logout" onClick={logout}>
          <Icon name="log-out" size={16} />
          Sair
        </button>
      </aside>

      <main className="app__content">
        <div className="app__content-inner">
          {children}
        </div>
      </main>
    </div>
  )
}
