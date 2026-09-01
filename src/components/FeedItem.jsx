import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { BookCover } from './BookCover'
import { Icon } from './Icon'
import { Stars } from './Stars'
import { idDe, handleUsuario, tempoRelativo } from '../utils/dados'

const FRASE = {
  inicio_leitura: 'iniciou a leitura de um livro',
  fim_leitura: 'finalizou uma leitura',
  resenha: 'escreveu uma resenha',
  lista: 'criou uma lista',
}

// "curtidas" e "comentários" não existem na API — o rodapé é só visual,
// com a curtida guardada localmente para dar retorno ao clique.
function Interacoes() {
  const [curtido, setCurtido] = useState(false)
  return (
    <div className="feed-card__actions">
      <button
        type="button"
        className={`feed-card__action${curtido ? ' is-active' : ''}`}
        onClick={() => setCurtido((v) => !v)}
        aria-pressed={curtido}
      >
        <Icon name="heart" size={16} />
        <span>Curtir</span>
      </button>
      <button type="button" className="feed-card__action">
        <Icon name="message-circle" size={16} />
        <span>Comentar</span>
      </button>
      <button type="button" className="feed-card__action feed-card__action--end" aria-label="Salvar">
        <Icon name="book" size={16} />
      </button>
    </div>
  )
}

function LinhaLivro({ livro, nota, texto }) {
  const livroId = idDe(livro)
  return (
    <div className="feed-card__body">
      <Link to={livroId ? `/livros/${livroId}` : '#'} className="feed-card__cover">
        <BookCover livro={livro} size="sm" />
      </Link>
      <div className="feed-card__book">
        <Link
          to={livroId ? `/livros/${livroId}` : '#'}
          className="feed-card__book-title"
        >
          {livro?.titulo || 'Livro'}
        </Link>
        {livro?.autores?.length > 0 && (
          <p className="feed-card__book-author">{livro.autores.join(', ')}</p>
        )}
        {typeof nota === 'number' && <Stars nota={nota} size={13} />}
        {texto && <p className="feed-card__quote">“{texto}”</p>}
      </div>
    </div>
  )
}

function BlocoLista({ lista, livros, totalLivros }) {
  const listaId = idDe(lista)
  return (
    <div className="feed-card__body feed-card__body--lista">
      <Link to={listaId ? `/listas/${listaId}` : '#'} className="feed-card__stack">
        {(livros.length ? livros.slice(0, 3) : [null, null, null]).map((l, i) => (
          <BookCover key={idDe(l) || i} livro={l} titulo={l ? undefined : ' '} size="sm" />
        ))}
      </Link>
      <div className="feed-card__book">
        <Link
          to={listaId ? `/listas/${listaId}` : '#'}
          className="feed-card__book-title"
        >
          {lista?.nome || 'Lista'}
        </Link>
        <p className="feed-card__list-count">
          {totalLivros} {totalLivros === 1 ? 'livro' : 'livros'}
        </p>
        {lista?.descricao && <p className="feed-card__quote">{lista.descricao}</p>}
      </div>
      {listaId && (
        <Link to={`/listas/${listaId}`} className="btn btn--ghost feed-card__ver-lista">
          Ver lista
        </Link>
      )}
    </div>
  )
}

export function FeedItem({ item }) {
  const { usuario, tipo, data } = item
  const usuarioId = idDe(usuario)
  const handle = handleUsuario(usuario)

  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <Link to={usuarioId ? `/usuarios/${usuarioId}` : '#'}>
          <Avatar usuario={usuario} size={30} />
        </Link>
        <div className="feed-card__meta">
          <Link
            to={usuarioId ? `/usuarios/${usuarioId}` : '#'}
            className="feed-card__user"
          >
            @{handle}
          </Link>
          <span className="feed-card__phrase">{FRASE[tipo] || 'registrou uma atividade'}</span>
          {data && <span className="feed-card__time">· {tempoRelativo(data)}</span>}
          <Icon name="compass" size={13} className="feed-card__globe" />
        </div>
        <button type="button" className="feed-card__more" aria-label="Mais opções">
          <Icon name="more-horizontal" size={18} />
        </button>
      </header>

      {tipo === 'lista' ? (
        <BlocoLista lista={item.lista} livros={item.livros} totalLivros={item.totalLivros} />
      ) : (
        <LinhaLivro livro={item.livro} nota={item.nota} texto={item.texto} />
      )}

      <Interacoes />
    </article>
  )
}
