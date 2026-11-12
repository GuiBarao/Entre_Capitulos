'use client'

import Link from 'next/link'

export function NaoEncontradaPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <div>
        <h1 className="page-title" style={{ fontSize: '3rem' }}>
          404
        </h1>
        <p className="page-subtitle">Esta página não existe.</p>
        <Link href="/" className="btn btn--primary" style={{ marginTop: 20 }}>
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
