import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { BookCover } from './BookCover'
import { Stars } from './Stars'
import { idDe, dataCurta } from '../utils/dados'

// Card de resenha. Use `mostrarLivro` no perfil (lista as resenhas do usuário)
// e `mostrarUsuario` na página do livro.
export function ReviewCard({
  resenha,
  mostrarUsuario = true,
  mostrarLivro = false,
  acoes = null,
}) {
  const [revelado, setRevelado] = useState(false)
  const usuario = resenha.usuario_id
  const livro = resenha.livro_id
  const usuarioId = idDe(usuario)
  const livroId = idDe(livro)
  const oculto = resenha.spoiler && !revelado

  return (
    <article className="review-card">
      {mostrarLivro && livro && typeof livro === 'object' && (
        <Link to={livroId ? `/livros/${livroId}` : '#'} className="review-card__book-cover">
          <BookCover livro={livro} size="sm" />
        </Link>
      )}

      <div className="review-card__body">
        <header className="review-card__head">
          {mostrarUsuario && usuario && typeof usuario === 'object' && (
            <Link to={usuarioId ? `/usuarios/${usuarioId}` : '#'} className="review-card__user">
              <Avatar usuario={usuario} size={30} />
              <span>{usuario.nome}</span>
            </Link>
          )}

          {mostrarLivro && livro && typeof livro === 'object' && (
            <Link to={livroId ? `/livros/${livroId}` : '#'} className="review-card__book-title">
              {livro.titulo}
            </Link>
          )}

          <div className="review-card__meta">
            <Stars nota={resenha.nota} size={14} />
            {resenha.criado_em && (
              <span className="review-card__date">{dataCurta(resenha.criado_em)}</span>
            )}
          </div>
        </header>

        {oculto ? (
          <button
            type="button"
            className="review-card__spoiler"
            onClick={() => setRevelado(true)}
          >
            Esta resenha contém spoiler. Clique para revelar.
          </button>
        ) : (
          <p className="review-card__text">
            {resenha.spoiler && <span className="review-card__spoiler-tag">Spoiler</span>}
            {resenha.texto}
          </p>
        )}

        {acoes && <div className="review-card__acoes">{acoes}</div>}
      </div>
    </article>
  )
}
