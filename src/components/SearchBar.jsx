import { useState } from 'react'
import { Icon } from './Icon'

// Campo de busca. Por padrão apenas dispara onSubmit com o texto;
// quem usa decide o que fazer (navegar para /explorar, filtrar, etc.).
export function SearchBar({
  placeholder = 'Buscar...',
  defaultValue = '',
  value,
  onChange,
  onSubmit,
  autoFocus = false,
  className = '',
}) {
  const controlado = value !== undefined
  const [interno, setInterno] = useState(defaultValue)
  const texto = controlado ? value : interno

  function handleChange(e) {
    if (!controlado) setInterno(e.target.value)
    onChange?.(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.(texto.trim())
  }

  return (
    <form className={`search-bar ${className}`} role="search" onSubmit={handleSubmit}>
      <Icon name="search" size={17} className="search-bar__icon" />
      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={texto}
        onChange={handleChange}
        autoFocus={autoFocus}
      />
    </form>
  )
}
