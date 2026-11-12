'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from '../components/FullPageLoader'

// Só aceita caminhos internos (evita redirecionar para outro site via ?from=).
export function destinoSeguro(from) {
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/'
}

// Envolve as rotas internas: sem sessão, manda para /entrar lembrando a origem.
export function ProtectedRoute({ children }) {
  const { autenticado, carregando } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace(`/entrar?from=${encodeURIComponent(pathname)}`)
    }
  }, [carregando, autenticado, pathname, router])

  if (carregando || !autenticado) return <FullPageLoader />

  return children
}

// Envolve as telas de acesso: com sessão ativa, volta para a origem (ou início).
export function PublicOnlyRoute({ children }) {
  const { autenticado, carregando } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const destino = destinoSeguro(searchParams.get('from'))

  useEffect(() => {
    if (!carregando && autenticado) router.replace(destino)
  }, [carregando, autenticado, destino, router])

  if (carregando || autenticado) return <FullPageLoader />

  return children
}
