import { AppLayout } from '../../layouts/AppLayout'
import { ProtectedRoute } from '../../routes/ProtectedRoute'

// Área autenticada: exige sessão e mostra a sidebar.
export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
