import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { useFeed } from '../hooks/useFeed'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { BookCover } from '../components/BookCover'
import { Modal } from '../components/Modal'
import { EditarPerfilForm } from '../components/EditarPerfilForm'
import { ReviewCard } from '../components/ReviewCard'
import { ListaCard } from '../components/ListaCard'
import { FeedItem } from '../components/FeedItem'
import { idDe, rotuloStatus, STATUS_ESTANTE } from '../utils/dados'
import './perfil.css'

const ABAS = ['Estante', 'Resenhas', 'Listas', 'Atividade']

export function PerfilPage() {
  const { id } = useParams()
  const { usuario: eu, atualizarUsuario } = useAuth()
  const perfilId = id || eu?._id
  const ehMeuPerfil = !!eu && perfilId === eu._id

  const { usuario, estante, resenhas, listas, seguidores, seguindo, carregando, erro, recarregar } =
    usePerfil(perfilId)
  const { itens: atividade, carregando: carregandoAtividade } = useFeed({
    usuarioId: perfilId,
    limite: 20,
  })

  const [aba, setAba] = useState('Estante')
  const [editando, setEditando] = useState(false)

  const lidos = useMemo(() => estante.filter((e) => e.status === 'lido'), [estante])
  const paginometro = useMemo(
    () =>
      lidos.reduce((soma, e) => {
        const p = e.livro_id && typeof e.livro_id === 'object' ? e.livro_id.paginas : 0
        return soma + (p || 0)
      }, 0),
    [lidos],
  )

  const estantePorStatus = useMemo(() => {
    const grupos = {}
    for (const s of STATUS_ESTANTE) {
      const itens = estante.filter((e) => e.status === s && typeof e.livro_id === 'object')
      if (itens.length) grupos[s] = itens
    }
    return grupos
  }, [estante])

  if (carregando) {
    return (
      <div className="perfil__estado">
        <div className="spinner" />
      </div>
    )
  }

  if (erro || !usuario) {
    return (
      <div className="perfil__estado">
        <p>{erro?.status === 404 ? 'Usuário não encontrado.' : erro?.message || 'Erro ao carregar.'}</p>
      </div>
    )
  }

  async function salvarPerfil(dados) {
    await atualizarUsuario(dados)
    setEditando(false)
    await recarregar()
  }

  const stats = [
    { valor: lidos.length, rotulo: 'Lidos' },
    { valor: seguidores.length, rotulo: 'Seguidores' },
    { valor: seguindo.length, rotulo: 'Seguindo' },
    { valor: paginometro.toLocaleString('pt-BR'), rotulo: 'Paginômetro' },
  ]

  return (
    <div className="perfil">
      <section className="perfil__card">
        <div className="perfil__topo">
          <Avatar usuario={usuario} size={72} />
          {ehMeuPerfil && (
            <button
              type="button"
              className="btn btn--ghost perfil__editar"
              onClick={() => setEditando(true)}
            >
              <Icon name="edit" size={15} />
              Editar perfil
            </button>
          )}
        </div>

        <h1 className="perfil__nome">{usuario.nome}</h1>
        {usuario.bio && <p className="perfil__bio">{usuario.bio}</p>}
        {usuario.cidade && (
          <p className="perfil__cidade">
            <Icon name="map-pin" size={14} />
            {usuario.cidade}
          </p>
        )}

        <div className="perfil__stats">
          {stats.map((s) => (
            <div key={s.rotulo} className="perfil__stat">
              <span className="perfil__stat-num">{s.valor}</span>
              <span className="perfil__stat-label">{s.rotulo}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="perfil__tabs" role="tablist">
        {ABAS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={aba === a}
            className={`perfil-tab${aba === a ? ' is-active' : ''}`}
            onClick={() => setAba(a)}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="perfil__conteudo">
        {aba === 'Estante' &&
          (Object.keys(estantePorStatus).length === 0 ? (
            <p className="perfil__vazio">Nenhum livro na estante ainda.</p>
          ) : (
            STATUS_ESTANTE.filter((s) => estantePorStatus[s]).map((s) => (
              <div key={s} className="perfil__grupo">
                <h3 className="perfil__grupo-titulo">
                  {rotuloStatus(s)} <span>({estantePorStatus[s].length})</span>
                </h3>
                <div className="perfil__capas">
                  {estantePorStatus[s].map((e) => (
                    <Link
                      key={e._id}
                      to={`/livros/${idDe(e.livro_id)}`}
                      className="perfil__capa"
                    >
                      <BookCover livro={e.livro_id} size="md" />
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ))}

        {aba === 'Resenhas' &&
          (resenhas.length === 0 ? (
            <p className="perfil__vazio">Nenhuma resenha publicada.</p>
          ) : (
            <div className="perfil__lista">
              {resenhas.map((r) => (
                <ReviewCard key={r._id} resenha={r} mostrarUsuario={false} mostrarLivro />
              ))}
            </div>
          ))}

        {aba === 'Listas' &&
          (listas.length === 0 ? (
            <p className="perfil__vazio">Nenhuma lista criada.</p>
          ) : (
            <div className="perfil__lista">
              {listas
                .filter((l) => ehMeuPerfil || l.publica !== false)
                .map((l) => (
                  <ListaCard key={idDe(l)} lista={l} />
                ))}
            </div>
          ))}

        {aba === 'Atividade' &&
          (carregandoAtividade ? (
            <div className="perfil__estado">
              <div className="spinner" />
            </div>
          ) : atividade.length === 0 ? (
            <p className="perfil__vazio">Sem atividade recente.</p>
          ) : (
            <ul className="feed">
              {atividade.map((item) => (
                <li key={item.id}>
                  <FeedItem item={item} />
                </li>
              ))}
            </ul>
          ))}
      </div>

      <Modal titulo="Editar perfil" aberto={editando} onFechar={() => setEditando(false)}>
        <EditarPerfilForm
          usuario={usuario}
          onSubmit={salvarPerfil}
          onCancelar={() => setEditando(false)}
        />
      </Modal>
    </div>
  )
}
