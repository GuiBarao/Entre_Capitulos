import { useMemo } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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

export function AppLayout() {
  const { usuario, logout } = useAuth()
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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' is-active' : ''}`
              }
            >
              <Icon name={item.icone} size={17} />
              {item.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__spacer" />

        <NavLink to="/perfil" className="sidebar__user">
          <Avatar usuario={usuario} size={40} />
          <span>
            <span className="sidebar__user-name">{usuario?.nome || 'Meu perfil'}</span>
            <br />
            <span className="sidebar__user-meta">
              {lidos} {lidos === 1 ? 'livro lido' : 'livros lidos'}
            </span>
          </span>
        </NavLink>

        <button type="button" className="btn btn--ghost sidebar__logout" onClick={logout}>
          <Icon name="log-out" size={16} />
          Sair
        </button>
      </aside>

      <main className="app__content">
        <div className="app__content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
