import { Suspense } from 'react'
import { ExplorarPage } from '../../../views/Explorar'

export const metadata = { title: 'Explorar' }

// Usa useSearchParams, que no Next precisa de um <Suspense> em volta.
export default function Page() {
  return (
    <Suspense>
      <ExplorarPage />
    </Suspense>
  )
}
