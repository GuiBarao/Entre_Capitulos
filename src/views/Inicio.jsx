'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useFeed } from '../hooks/useFeed'
import { useIdsSeguidos } from '../hooks/useIdsSeguidos'
import { SearchBar } from '../components/SearchBar'
import { FeedItem } from '../components/FeedItem'
import { idDe } from '../utils/dados'
import './inicio.css'

export function InicioPage() {
  const router = useRouter()
  const { usuario } = useAuth()
  const { itens, carregando, erro } = useFeed({ limite: 40 })
  const { ids: seguidos } = useIdsSeguidos(usuario?._id)

  const [escopo, setEscopo] = useState('seguindo') // 'seguindo' | 'todos'

  function buscar(q) {
    if (q) router.push(`/explorar?q=${encodeURIComponent(q)}`)
    else router.push('/explorar')
  }

  const visiveis = useMemo(() => {
    if (escopo === 'todos') return itens.slice(0, 30)
    return itens
      .filter((i) => {
        const uid = idDe(i.usuario)
        return uid === usuario?._id || seguidos.has(uid)
      })
      .slice(0, 30)
  }, [itens, escopo, seguidos, usuario])

  return (
    <div className="inicio">
      <SearchBar
        className="inicio__search"
        placeholder="Buscar livros, autores, usuários ou listas..."
        onSubmit={buscar}
      />

      <header className="inicio__header">
        <h1 className="page-title">Início</h1>
        <p className="page-subtitle">
          Acompanhe leituras, resenhas e listas da sua comunidade.
        </p>
      </header>

      <div className="inicio__escopo" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={escopo === 'seguindo'}
          className={`inicio__escopo-btn${escopo === 'seguindo' ? ' is-active' : ''}`}
          onClick={() => setEscopo('seguindo')}
        >
          Seguindo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={escopo === 'todos'}
          className={`inicio__escopo-btn${escopo === 'todos' ? ' is-active' : ''}`}
          onClick={() => setEscopo('todos')}
        >
          Todos
        </button>
      </div>

      {carregando && (
        <div className="inicio__estado">
          <div className="spinner" />
        </div>
      )}

      {erro && !carregando && (
        <p className="inicio__estado inicio__estado--erro">
          Não foi possível carregar o feed. {erro.message}
        </p>
      )}

      {!carregando && !erro && visiveis.length === 0 && (
        <p className="inicio__estado">
          {escopo === 'seguindo'
            ? 'As pessoas que você segue ainda não têm atividade. Veja "Todos" ou descubra leitores no Explorar.'
            : 'Ainda não há atividade por aqui. Comece adicionando livros à sua estante.'}
        </p>
      )}

      {!carregando && !erro && visiveis.length > 0 && (
        <ul className="feed">
          {visiveis.map((item) => (
            <li key={item.id}>
              <FeedItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
