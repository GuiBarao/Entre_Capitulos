import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from '../components/FullPageLoader'

export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <FullPageLoader />

  if (!autenticado) {
    return <Navigate to="/entrar" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { autenticado, carregando } = useAuth()

  if (carregando) return <FullPageLoader />
  if (autenticado) return <Navigate to="/" replace />

  return <Outlet />
}
