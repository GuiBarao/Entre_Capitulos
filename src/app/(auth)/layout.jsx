import { Suspense } from 'react'
import { AuthLayout } from '../../layouts/AuthLayout'
import { PublicOnlyRoute } from '../../routes/ProtectedRoute'
import { FullPageLoader } from '../../components/FullPageLoader'

// Telas de acesso (/entrar, /cadastro): só para quem não está logado.
export default function Layout({ children }) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <PublicOnlyRoute>
        <AuthLayout>{children}</AuthLayout>
      </PublicOnlyRoute>
    </Suspense>
  )
}
