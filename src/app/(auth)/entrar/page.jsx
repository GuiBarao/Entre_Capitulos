import { Suspense } from 'react'
import { EntrarPage } from '../../../views/Entrar'

export const metadata = { title: 'Entrar' }

// Usa useSearchParams, que no Next precisa de um <Suspense> em volta.
export default function Page() {
  return (
    <Suspense>
      <EntrarPage />
    </Suspense>
  )
}
