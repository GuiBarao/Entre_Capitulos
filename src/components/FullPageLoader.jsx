export function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'var(--cream)',
      }}
    >
      <div className="spinner" role="status" aria-label="Carregando" />
    </div>
  )
}
