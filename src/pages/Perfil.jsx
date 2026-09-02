import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerfil } from '../hooks/usePerfil'
import { useFeed } from '../hooks/useFeed'
import { seguidores as seguidoresApi } from '../api/resources'
import { registrarAtividade, descricaoAtividade } from '../api/atividades'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { BookCover } from '../components/BookCover'
import { Modal } from '../components/Modal'
import { EditarPerfilForm } from '../components/EditarPerfilForm'
import { ReviewCard } from '../components/ReviewCard'
import { ListaCard } from '../components/ListaCard'
import { FeedItem } from '../components/FeedItem'
import { SeguidoresModal } from '../components/SeguidoresModal'
import { idDe, rotuloStatus, STATUS_ESTANTE } from '../utils/dados'
import './perfil.css'

const ABAS = ['Estante', 'Resenhas', 'Listas', 'Atividade']

export function PerfilPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario: eu, atualizarUsuario, excluirConta } = useAuth()
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
  const [modalSeguir, setModalSeguir] = useState(null) // 'seguidores' | 'seguindo'
  const [processandoSeguir, setProcessandoSeguir] = useState(false)

  const meuRegistroSeguir = useMemo(
    () => (eu ? seguidores.find((r) => idDe(r.seguidor_id) === eu._id) : null),
    [seguidores, eu],
  )
  const jaSegue = Boolean(meuRegistroSeguir)

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

  async function excluirMinhaConta() {
    await excluirConta()
    navigate('/entrar', { replace: true })
  }

  async function alternarSeguir() {
    if (!eu || processandoSeguir) return
    setProcessandoSeguir(true)
    try {
      if (meuRegistroSeguir) {
        await seguidoresApi.excluir(meuRegistroSeguir._id)
      } else {
        await seguidoresApi.criar({ seguidor_id: eu._id, seguido_id: perfilId })
        registrarAtividade(eu._id, 'seguir', descricaoAtividade.seguir(usuario.nome))
      }
      await recarregar()
    } finally {
      setProcessandoSeguir(false)
    }
  }

  const perfilPrivado = usuario.privado && !ehMeuPerfil && !jaSegue

  const stats = [
    { valor: lidos.length, rotulo: 'Lidos' },
    {
      valor: seguidores.length,
      rotulo: 'Seguidores',
      acao: () => setModalSeguir('seguidores'),
    },
    { valor: seguindo.length, rotulo: 'Seguindo', acao: () => setModalSeguir('seguindo') },
    { valor: paginometro.toLocaleString('pt-BR'), rotulo: 'Paginômetro' },
  ]

  return (
    <div className="perfil">
      <section className="perfil__card">
        <div className="perfil__topo">
          <Avatar usuario={usuario} size={72} />
          {ehMeuPerfil ? (
            <button
              type="button"
              className="btn btn--ghost perfil__editar"
              onClick={() => setEditando(true)}
            >
              <Icon name="edit" size={15} />
              Editar perfil
            </button>
          ) : (
            eu && (
              <button
                type="button"
                className={`btn ${jaSegue ? 'btn--ghost' : 'btn--primary'} perfil__editar`}
                onClick={alternarSeguir}
                disabled={processandoSeguir}
              >
                <Icon name={jaSegue ? 'check' : 'plus'} size={15} />
                {jaSegue ? 'Seguindo' : 'Seguir'}
              </button>
            )
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
          {stats.map((s) => {
            const Tag = s.acao ? 'button' : 'div'
            return (
              <Tag
                key={s.rotulo}
                type={s.acao ? 'button' : undefined}
                className={`perfil__stat${s.acao ? ' perfil__stat--btn' : ''}`}
                onClick={s.acao}
              >
                <span className="perfil__stat-num">{s.valor}</span>
                <span className="perfil__stat-label">{s.rotulo}</span>
              </Tag>
            )
          })}
        </div>
      </section>

      {perfilPrivado && (
        <div className="perfil__privado">
          <Icon name="user" size={22} />
          <p>Este perfil é privado. Siga {usuario.nome} para ver as leituras.</p>
        </div>
      )}

      {!perfilPrivado && (
      <>
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
      </>
      )}

      <Modal titulo="Editar perfil" aberto={editando} onFechar={() => setEditando(false)}>
        <EditarPerfilForm
          usuario={usuario}
          onSubmit={salvarPerfil}
          onCancelar={() => setEditando(false)}
          onExcluir={excluirMinhaConta}
        />
      </Modal>

      <SeguidoresModal
        aberto={modalSeguir === 'seguidores'}
        onFechar={() => setModalSeguir(null)}
        titulo="Seguidores"
        registros={seguidores}
        campo="seguidor_id"
      />
      <SeguidoresModal
        aberto={modalSeguir === 'seguindo'}
        onFechar={() => setModalSeguir(null)}
        titulo="Seguindo"
        registros={seguindo}
        campo="seguido_id"
      />
    </div>
  )
}
