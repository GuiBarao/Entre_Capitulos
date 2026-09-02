import { useEffect } from 'react'
import { Icon } from './Icon'

// Modal simples centralizado com overlay. Fecha no ESC e no clique fora.
export function Modal({ titulo, aberto, onFechar, children }) {
  useEffect(() => {
    if (!aberto) return
    function onKey(e) {
      if (e.key === 'Escape') onFechar?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div className="modal" onMouseDown={onFechar}>
      <div
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <h2 className="modal__title">{titulo}</h2>
          <button type="button" className="modal__close" onClick={onFechar} aria-label="Fechar">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
