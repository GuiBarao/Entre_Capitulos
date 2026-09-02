import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalogo } from '../hooks/useCatalogo'
import { useListas } from '../hooks/useListas'
import { SearchBar } from '../components/SearchBar'
import { BookListItem } from '../components/BookListItem'
import { BookCover } from '../components/BookCover'
import { Stars } from '../components/Stars'
import { Icon } from '../components/Icon'
import { ListaCard } from '../components/ListaCard'
import { Link } from 'react-router-dom'
import { idDe, semAcento } from '../utils/dados'
import './explorar.css'

const CATEGORIAS = [
  'Todos',
  'Romance',
  'Ficção',
  'Clássico',
  'Regional',
  'Autobiografia',
  'Naturalismo',
]

function normaliza(texto) {
  return semAcento(String(texto || '')).toLowerCase()
}

function combina(livro, termo) {
  if (!termo) return true
  const alvo = normaliza(
    [livro.titulo, livro.autores?.join(' '), livro.isbn, livro.editora, livro.sinopse]
      .filter(Boolean)
      .join(' '),
  )
  return alvo.includes(normaliza(termo))
}

export function ExplorarPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { livros, carregando, erro } = useCatalogo()
  const { listas } = useListas()

  const [busca, setBusca] = useState(searchParams.get('q') || '')
  const [categoria, setCategoria] = useState('Todos')
  const catalogoRef = useRef(null)

  // mantém a query na URL em sincronia com o campo de busca
  useEffect(() => {
    const atual = searchParams.get('q') || ''
    if (busca !== atual) {
      const next = new URLSearchParams(searchParams)
      if (busca) next.set('q', busca)
      else next.delete('q')
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca])

  const filtrados = useMemo(() => {
    const cat = categoria === 'Todos' ? '' : categoria
    return livros.filter((l) => combina(l, busca) && combina(l, cat))
  }, [livros, busca, categoria])

  const melhores = useMemo(
    () =>
      livros
        .filter((l) => l.media != null)
        .sort((a, b) => b.media - a.media || b.qtdResenhas - a.qtdResenhas)
        .slice(0, 5),
    [livros],
  )

  const listasEncontradas = useMemo(() => {
    const termo = normaliza(busca.trim())
    if (!termo) return []
    return listas
      .filter((l) => l.publica !== false)
      .filter((l) => normaliza(`${l.nome} ${l.descricao || ''}`).includes(termo))
      .slice(0, 6)
  }, [listas, busca])

  function verTodos() {
    catalogoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="explorar">
      <header className="explorar__cabecalho">
        <h1 className="page-title">Explorar</h1>
        <Link to="/livros/novo" className="btn btn--ghost">
          <Icon name="plus" size={16} />
          Novo livro
        </Link>
      </header>

      <SearchBar
        className="explorar__search"
        placeholder="Buscar livros, autores, ISBN..."
        value={busca}
        onChange={setBusca}
        onSubmit={setBusca}
      />

      <div className="explorar__chips">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${categoria === c ? ' is-active' : ''}`}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {carregando && (
        <div className="explorar__estado">
          <div className="spinner" />
        </div>
      )}

      {erro && !carregando && (
        <p className="explorar__estado explorar__estado--erro">
          Não foi possível carregar o catálogo. {erro.message}
        </p>
      )}

      {!carregando && !erro && (
        <>
          {busca.trim() && listasEncontradas.length > 0 && (
            <section className="explorar__section">
              <header className="explorar__section-head">
                <h2>Listas</h2>
                <span className="explorar__contagem">
                  {listasEncontradas.length}{' '}
                  {listasEncontradas.length === 1 ? 'lista' : 'listas'}
                </span>
              </header>
              <div className="explorar__lista">
                {listasEncontradas.map((l) => (
                  <ListaCard key={idDe(l)} lista={l} />
                ))}
              </div>
            </section>
          )}

          {melhores.length > 0 && !busca && categoria === 'Todos' && (
            <section className="explorar__section">
              <header className="explorar__section-head">
                <h2>Mais bem avaliados</h2>
                <button type="button" className="explorar__ver-todos" onClick={verTodos}>
                  Ver todos
                </button>
              </header>
              <div className="explorar__destaques">
                {melhores.map((l) => (
                  <Link key={idDe(l)} to={`/livros/${idDe(l)}`} className="destaque">
                    <BookCover livro={l} size="md" />
                    <span className="destaque__title">{l.titulo}</span>
                    <span className="destaque__rating">
                      <Stars nota={l.media} size={12} />
                      {l.media.toFixed(1)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="explorar__section" ref={catalogoRef}>
            <header className="explorar__section-head">
              <h2>Catálogo</h2>
              <span className="explorar__contagem">
                {filtrados.length} {filtrados.length === 1 ? 'livro' : 'livros'}
              </span>
            </header>

            {filtrados.length === 0 ? (
              <p className="explorar__estado">Nenhum livro encontrado.</p>
            ) : (
              <div className="explorar__lista">
                {filtrados.map((l) => (
                  <BookListItem key={idDe(l)} livro={l} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
