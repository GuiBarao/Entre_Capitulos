import { Icon } from './Icon'

// Exibição de nota (0–5). Para entrada de nota use `interativa` + `onChange`.
export function Stars({ nota = 0, size = 14, interativa = false, onChange, className = '' }) {
  const valor = Math.round(nota)

  if (interativa) {
    return (
      <span className={`stars stars--input ${className}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`stars__btn${n <= valor ? ' is-on' : ''}`}
            onClick={() => onChange?.(n)}
            aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
            aria-pressed={n <= valor}
          >
            <Icon name="star" size={size + 6} />
          </button>
        ))}
      </span>
    )
  }

  return (
    <span
      className={`stars ${className}`}
      role="img"
      aria-label={`Nota ${valor} de 5`}
      style={{ '--star-size': `${size}px` }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          size={size}
          className={n <= valor ? 'stars__star is-on' : 'stars__star'}
        />
      ))}
    </span>
  )
}
