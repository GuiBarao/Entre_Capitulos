'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useEstanteUsuario } from '../hooks/useEstanteUsuario'
import { BookCover } from '../components/BookCover'
import { idDe, mesAno } from '../utils/dados'
import './estante.css'

const STATUS = [
  { key: 'lendo', rotulo: 'Lendo', cor: '#4caf50' },
  { key: 'quero_ler', rotulo: 'Quero ler', cor: '#e0872e' },
  { key: 'lido', rotulo: 'Lido', cor: '#3f6fd8' },
  { key: 'abandonado', rotulo: 'Abandonado', cor: '#8a2b3a' },
]

function EstanteCard({ registro }) {
  const livro = registro.livro_id
  if (!livro || typeof livro !== 'object') return null

  const livroId = idDe(livro)
  const { status, progresso = 0 } = registro
  const paginas = livro.paginas
  const paginaAtual = paginas ? Math.round((progresso / 100) * paginas) : null

  return (
    <article className="estante-card">
      <Link href={livroId ? `/livros/${livroId}` : '#'} className="estante-card__cover">
        <BookCover livro={livro} size="md" />
      </Link>

      <div className="estante-card__body">
        <div className="estante-card__topo">
          <div>
            <Link
              href={livroId ? `/livros/${livroId}` : '#'}
              className="estante-card__titulo"
            >
              {livro.titulo}
            </Link>
            {livro.autores?.length > 0 && (
              <p className="estante-card__autor">{livro.autores.join(', ')}</p>
            )}
            {(livro.editora || livro.ano) && (
              <p className="estante-card__edicao">
                {[livro.editora, livro.ano].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          {status === 'lido' && registro.data_conclusao && (
            <span className="estante-card__data">
              Concluído em
              <br />
              <strong>{mesAno(registro.data_conclusao)}</strong>
            </span>
          )}
          {status !== 'lido' && registro.data_inicio && (
            <span className="estante-card__data">
              Iniciado em
              <br />
              <strong>{mesAno(registro.data_inicio)}</strong>
            </span>
          )}
        </div>

        {(status === 'lendo' || status === 'abandonado') && (
          <div className="estante-card__progresso">
            <div className="estante-card__progresso-topo">
              <span>Progresso</span>
              <span className="estante-card__pct">{progresso}%</span>
            </div>
            <div className="progress-bar">
              <span className="progress-bar__fill" style={{ width: `${progresso}%` }} />
            </div>
            {paginaAtual != null && (
              <p className="estante-card__paginas">
                ~{paginaAtual} de {paginas} páginas
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export function EstantePage() {
  const { usuario } = useAuth()
  const { itens, carregando, erro } = useEstanteUsuario(usuario?._id)
  const [aba, setAba] = useState('lendo')

  const contagem = useMemo(() => {
    const c = { lendo: 0, quero_ler: 0, lido: 0, abandonado: 0 }
    for (const e of itens) if (c[e.status] != null) c[e.status] += 1
    return c
  }, [itens])

  const daAba = useMemo(
    () => itens.filter((e) => e.status === aba),
    [itens, aba],
  )

  return (
    <div className="estante">
      <h1 className="page-title">Minha Estante</h1>

      <div className="estante__stats">
        {STATUS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`estante-stat${aba === s.key ? ' is-active' : ''}`}
            onClick={() => setAba(s.key)}
          >
            <span className="estante-stat__num">{contagem[s.key]}</span>
            <span className="estante-stat__label">{s.rotulo}</span>
          </button>
        ))}
      </div>

      <div className="estante__tabs" role="tablist">
        {STATUS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={aba === s.key}
            className={`estante-tab${aba === s.key ? ' is-active' : ''}`}
            onClick={() => setAba(s.key)}
          >
            <span className="estante-tab__dot" style={{ backgroundColor: s.cor }} />
            {s.rotulo} <span className="estante-tab__count">({contagem[s.key]})</span>
          </button>
        ))}
      </div>

      {carregando && (
        <div className="estante__estado">
          <div className="spinner" />
        </div>
      )}

      {erro && !carregando && (
        <p className="estante__estado estante__estado--erro">
          Não foi possível carregar sua estante. {erro.message}
        </p>
      )}

      {!carregando && !erro && daAba.length === 0 && (
        <p className="estante__estado">
          Nenhum livro em “{STATUS.find((s) => s.key === aba)?.rotulo}”.{' '}
          <Link href="/explorar">Explorar livros</Link>
        </p>
      )}

      {!carregando && !erro && daAba.length > 0 && (
        <div className="estante__lista">
          {daAba.map((e) => (
            <EstanteCard key={e._id} registro={e} />
          ))}
        </div>
      )}
    </div>
  )
}
