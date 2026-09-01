import { idDe } from '../utils/dados'

// Capa de livro. Usa capa_url quando existir; senão gera uma "lombada"
// colorida com o título, no estilo do protótipo.

const PALETA = [
  '#6e1f2e',
  '#1f6e5b',
  '#5b2d82',
  '#b05a1e',
  '#1e3a5f',
  '#8a1f5b',
  '#2f6e2f',
  '#20566e',
  '#7a3b1e',
  '#3b2f7a',
]

function corDoLivro(chave = '') {
  let hash = 0
  for (let i = 0; i < chave.length; i += 1) {
    hash = (hash << 5) - hash + chave.charCodeAt(i)
    hash |= 0
  }
  return PALETA[Math.abs(hash) % PALETA.length]
}

const TAMANHOS = {
  xs: { w: 36, h: 52, fs: 7 },
  sm: { w: 52, h: 74, fs: 8.5 },
  md: { w: 88, h: 128, fs: 12 },
  lg: { w: 120, h: 176, fs: 15 },
}

export function BookCover({ livro, titulo, size = 'sm', className = '' }) {
  const nome = titulo ?? livro?.titulo ?? ''
  const autor = livro?.autores?.[0] || ''
  const capa = livro?.capa_url || ''
  const dim = TAMANHOS[size] || TAMANHOS.sm
  const estilo = { width: dim.w, height: dim.h }

  if (capa) {
    return (
      <span className={`book-cover ${className}`} style={estilo}>
        <img src={capa} alt={nome ? `Capa de ${nome}` : ''} loading="lazy" />
      </span>
    )
  }

  const cor = corDoLivro(idDe(livro) || nome)

  return (
    <span
      className={`book-cover book-cover--gen ${className}`}
      style={{ ...estilo, backgroundColor: cor, fontSize: dim.fs }}
      role="img"
      aria-label={nome ? `Capa de ${nome}` : 'Capa do livro'}
    >
      <span className="book-cover__title">{nome}</span>
      {autor && size !== 'xs' && <span className="book-cover__author">{autor}</span>}
    </span>
  )
}
