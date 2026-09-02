import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useListas } from '../hooks/useListas'
import { listas as listasApi } from '../api/resources'
import { BookCover } from '../components/BookCover'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { ListaForm } from '../components/ListaForm'
import { idDe } from '../utils/dados'
import './listas.css'

function ListaCard({ lista }) {
  const capas = lista.livros.slice(0, 3)
  return (
    <Link to={`/listas/${idDe(lista)}`} className="lista-card">
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
          {lista.total} {lista.total === 1 ? 'livro' : 'livros'}
          {lista.publica === false && ' · privada'}
        </span>
      </div>

      <Icon name="chevron-right" size={20} className="lista-card__seta" />
    </Link>
  )
}

export function ListasPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const { listas, carregando, erro, recarregar } = useListas(usuario?._id)
  const [modalAberto, setModalAberto] = useState(false)

  async function criar(dados) {
    const nova = await listasApi.criar({ ...dados, usuario_id: usuario._id })
    setModalAberto(false)
    await recarregar()
    if (nova?._id) navigate(`/listas/${nova._id}`)
  }

  return (
    <div className="listas">
      <header className="listas__header">
        <h1 className="page-title">Minhas Listas</h1>
        <button type="button" className="btn btn--primary" onClick={() => setModalAberto(true)}>
          <Icon name="plus" size={16} />
          Nova lista
        </button>
      </header>

      {carregando && (
        <div className="listas__estado">
          <div className="spinner" />
        </div>
      )}

      {erro && !carregando && (
        <p className="listas__estado listas__estado--erro">
          Não foi possível carregar suas listas. {erro.message}
        </p>
      )}

      {!carregando && !erro && listas.length === 0 && (
        <p className="listas__estado">
          Você ainda não criou nenhuma lista. Que tal começar uma?
        </p>
      )}

      {!carregando && !erro && listas.length > 0 && (
        <div className="listas__grid">
          {listas.map((l) => (
            <ListaCard key={idDe(l)} lista={l} />
          ))}
        </div>
      )}

      <Modal titulo="Nova lista" aberto={modalAberto} onFechar={() => setModalAberto(false)}>
        <ListaForm onSubmit={criar} onCancelar={() => setModalAberto(false)} />
      </Modal>
    </div>
  )
}
