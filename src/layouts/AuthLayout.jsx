import { Outlet } from 'react-router-dom'

// Shell das telas públicas (entrar / cadastro). O painel lateral da marca,
// conforme o protótipo, será finalizado na tarefa de autenticação.

export function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Outlet />
      </div>
    </div>
  )
}
