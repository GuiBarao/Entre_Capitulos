import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Shell básico da área autenticada. O layout definitivo (sidebar do protótipo,
// busca no topo, mini-perfil) será construído na sua própria tarefa.

const navItens = [
  { to: '/', rotulo: 'Início', end: true },
  { to: '/explorar', rotulo: 'Explorar' },
  { to: '/estante', rotulo: 'Minha Estante' },
  { to: '/listas', rotulo: 'Minhas Listas' },
  { to: '/perfil', rotulo: 'Meu Perfil' },
]

export function AppLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 'var(--sidebar-width)',
          borderRight: '1px solid var(--border)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          backgroundColor: 'var(--surface)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--wine)' }}>
          Entre Capítulos
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
          {navItens.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--text-on-wine)' : 'var(--text)',
                backgroundColor: isActive ? 'var(--wine)' : 'transparent',
                textDecoration: 'none',
              })}
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', fontSize: '0.9rem' }}>
          <div style={{ color: 'var(--text-muted)' }}>{usuario?.nome}</div>
          <button type="button" className="btn btn--ghost" style={{ marginTop: 8 }} onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '28px 36px', maxWidth: 980 }}>
        <Outlet />
      </main>
    </div>
  )
}
