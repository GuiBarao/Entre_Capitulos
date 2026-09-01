import { useNavigate } from 'react-router-dom'
import { useFeed } from '../hooks/useFeed'
import { SearchBar } from '../components/SearchBar'
import { FeedItem } from '../components/FeedItem'
import './inicio.css'

export function InicioPage() {
  const navigate = useNavigate()
  const { itens, carregando, erro } = useFeed({ limite: 30 })

  function buscar(q) {
    if (q) navigate(`/explorar?q=${encodeURIComponent(q)}`)
    else navigate('/explorar')
  }

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

      {!carregando && !erro && itens.length === 0 && (
        <p className="inicio__estado">
          Ainda não há atividade por aqui. Comece adicionando livros à sua estante.
        </p>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <ul className="feed">
          {itens.map((item) => (
            <li key={item.id}>
              <FeedItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
