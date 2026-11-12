import Link from 'next/link'
import { BookCover } from './BookCover'
import { Icon } from './Icon'
import { idDe } from '../utils/dados'

// Card de lista usado no índice de listas e no perfil.
export function ListaCard({ lista }) {
  const capas = (lista.livros || []).slice(0, 3)
  return (
    <Link href={`/listas/${idDe(lista)}`} className="lista-card">
      <div className="lista-card__capas">
        {capas.length > 0 ? (
          capas.map((item, i) => (
            <BookCover key={item.relId || i} livro={item.livro} size="sm" />
          ))
        ) : (
          <div className="lista-card__vazia">
            <Icon name="book" size={20} />
          </div>
        )}
      </div>

      <div className="lista-card__info">
        <h3 className="lista-card__nome">{lista.nome}</h3>
        {lista.descricao && <p className="lista-card__desc">{lista.descricao}</p>}
        <span className="lista-card__total">
          {lista.total ?? lista.livros?.length ?? 0}{' '}
          {(lista.total ?? lista.livros?.length ?? 0) === 1 ? 'livro' : 'livros'}
          {lista.publica === false && ' · privada'}
        </span>
      </div>

      <Icon name="chevron-right" size={20} className="lista-card__seta" />
    </Link>
  )
}
