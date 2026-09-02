import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useListas } from '../hooks/useListas'
import { listas as listasApi } from '../api/resources'
import { registrarAtividade, descricaoAtividade } from '../api/atividades'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { ListaForm } from '../components/ListaForm'
import { ListaCard } from '../components/ListaCard'
import { idDe } from '../utils/dados'
import './listas.css'

export function ListasPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const { listas, carregando, erro, recarregar } = useListas(usuario?._id)
  const [modalAberto, setModalAberto] = useState(false)

  async function criar(dados) {
    const nova = await listasApi.criar({ ...dados, usuario_id: usuario._id })
    registrarAtividade(usuario._id, 'lista', descricaoAtividade.lista(dados.nome))
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
