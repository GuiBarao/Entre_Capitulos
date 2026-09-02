import { Link } from 'react-router-dom'
import { BookCover } from './BookCover'
import { Stars } from './Stars'
import { idDe } from '../utils/dados'

// Linha de livro do catálogo / resultados de busca.
export function BookListItem({ livro }) {
  const id = idDe(livro)
  const tags = (livro.tags || livro.generos || []).filter(Boolean)

  return (
    <Link to={id ? `/livros/${id}` : '#'} className="book-row card">
      <BookCover livro={livro} size="sm" />

      <div className="book-row__main">
        <h3 className="book-row__title">{livro.titulo}</h3>
        {livro.autores?.length > 0 && (
          <p className="book-row__author">{livro.autores.join(', ')}</p>
        )}

        {livro.media != null ? (
          <span className="book-row__rating">
            <Stars nota={livro.media} size={13} />
            <span>{livro.media.toFixed(1)}</span>
          </span>
        ) : (
          <span className="book-row__rating book-row__rating--empty">Sem avaliações</span>
        )}

        {tags.length > 0 && (
          <div className="book-row__tags">
            {tags.map((t) => (
              <span key={t} className="chip chip--sm">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="book-row__aside">
        {livro.ano && <span>{livro.ano}</span>}
        {livro.paginas && <span>{livro.paginas} páginas</span>}
      </div>
    </Link>
  )
}
