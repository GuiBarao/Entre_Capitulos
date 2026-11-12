'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useListas } from '../hooks/useListas'
import { useCatalogo } from '../hooks/useCatalogo'
import { listas as listasApi, livroListas as livroListasApi } from '../api/resources'
import { BookCover } from '../components/BookCover'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { ListaForm } from '../components/ListaForm'
import { SearchBar } from '../components/SearchBar'
import { idDe, mesmoId, semAcento } from '../utils/dados'
import './listas.css'

export function ListaPage() {
  const { id } = useParams()
  const router = useRouter()
  const { usuario } = useAuth()
  const { listas, carregando, erro, recarregar } = useListas()

  const lista = useMemo(() => listas.find((l) => mesmoId(l, id)), [listas, id])
  const dono = lista && usuario && mesmoId(lista.usuario_id, usuario._id)

  const [editando, setEditando] = useState(false)
  const [buscaLivro, setBuscaLivro] = useState('')
  const [ocupado, setOcupado] = useState(false)

  if (carregando) {
    return (
      <div className="lista-det__estado">
        <div className="spinner" />
      </div>
    )
  }

  if (erro || !lista) {
    return (
      <div className="lista-det__estado">
        <p>{erro ? erro.message : 'Lista não encontrada.'}</p>
        <button type="button" className="btn btn--ghost" onClick={() => router.push('/listas')}>
          Minhas listas
        </button>
      </div>
    )
  }

  if (lista.publica === false && !dono) {
    return (
      <div className="lista-det__estado">
        <p>Esta lista é privada.</p>
      </div>
    )
  }

  async function salvarEdicao(dados) {
    await listasApi.atualizar(idDe(lista), dados)
    setEditando(false)
    await recarregar()
  }

  async function excluirLista() {
    if (!window.confirm(`Excluir a lista "${lista.nome}"?`)) return
    await listasApi.excluir(idDe(lista))
    router.push('/listas')
  }

  async function adicionarLivro(livroId) {
    setOcupado(true)
    try {
      await livroListasApi.criar({ lista_id: idDe(lista), livro_id: livroId })
      await recarregar()
    } finally {
      setOcupado(false)
    }
  }

  async function removerLivro(relId) {
    setOcupado(true)
    try {
      await livroListasApi.excluir(relId)
      await recarregar()
    } finally {
      setOcupado(false)
    }
  }

  const donoNome =
    lista.usuario_id && typeof lista.usuario_id === 'object' ? lista.usuario_id.nome : null

  return (
    <div className="lista-det">
      <Link href="/listas" className="lista-det__voltar">
        <Icon name="chevron-left" size={16} />
        Minhas listas
      </Link>

      <header className="lista-det__header">
        <div>
          <h1 className="page-title">{lista.nome}</h1>
          {lista.descricao && <p className="lista-det__desc">{lista.descricao}</p>}
          <p className="lista-det__meta">
            {lista.total} {lista.total === 1 ? 'livro' : 'livros'} ·{' '}
            {lista.publica === false ? 'Privada' : 'Pública'}
            {donoNome && !dono && (
              <>
                {' '}
                · por{' '}
                <Link href={`/usuarios/${idDe(lista.usuario_id)}`}>{donoNome}</Link>
              </>
            )}
          </p>
        </div>

        {dono && (
          <div className="lista-det__acoes">
            <button type="button" className="btn btn--ghost" onClick={() => setEditando(true)}>
              <Icon name="edit" size={15} />
              Editar
            </button>
            <button
              type="button"
              className="btn btn--ghost lista-det__excluir"
              onClick={excluirLista}
            >
              <Icon name="x" size={15} />
              Excluir
            </button>
          </div>
        )}
      </header>

      {dono && (
        <AdicionarLivro
          jaNaLista={lista.livros}
          busca={buscaLivro}
          setBusca={setBuscaLivro}
          onAdicionar={adicionarLivro}
          desabilitado={ocupado}
        />
      )}

      {lista.livros.length === 0 ? (
        <p className="lista-det__estado">Esta lista ainda não tem livros.</p>
      ) : (
        <div className="lista-det__livros">
          {lista.livros.map((item) => {
            const livroId = idDe(item.livro)
            return (
              <div key={item.relId} className="lista-livro">
                <Link href={livroId ? `/livros/${livroId}` : '#'} className="lista-livro__cover">
                  <BookCover livro={item.livro} size="md" />
                </Link>
                <Link
                  href={livroId ? `/livros/${livroId}` : '#'}
                  className="lista-livro__titulo"
                >
                  {item.livro?.titulo || 'Livro'}
                </Link>
                {item.livro?.autores?.length > 0 && (
                  <span className="lista-livro__autor">{item.livro.autores.join(', ')}</span>
                )}
                {dono && (
                  <button
                    type="button"
                    className="lista-livro__remover"
                    onClick={() => removerLivro(item.relId)}
                    disabled={ocupado}
                    aria-label="Remover da lista"
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal titulo="Editar lista" aberto={editando} onFechar={() => setEditando(false)}>
        <ListaForm
          listaAtual={lista}
          onSubmit={salvarEdicao}
          onCancelar={() => setEditando(false)}
        />
      </Modal>
    </div>
  )
}

function AdicionarLivro({ jaNaLista, busca, setBusca, onAdicionar, desabilitado }) {
  const { livros } = useCatalogo()

  const idsNaLista = useMemo(
    () => new Set(jaNaLista.map((i) => idDe(i.livro)).filter(Boolean)),
    [jaNaLista],
  )

  const resultados = useMemo(() => {
    const termo = semAcento(busca.trim()).toLowerCase()
    if (!termo) return []
    return livros
      .filter((l) => !idsNaLista.has(idDe(l)))
      .filter((l) =>
        semAcento(`${l.titulo} ${l.autores?.join(' ') || ''}`)
          .toLowerCase()
          .includes(termo),
      )
      .slice(0, 6)
  }, [livros, busca, idsNaLista])

  return (
    <div className="lista-add">
      <SearchBar
        placeholder="Buscar um livro para adicionar..."
        value={busca}
        onChange={setBusca}
        onSubmit={setBusca}
      />
      {busca.trim() && resultados.length === 0 && (
        <p className="lista-add__vazio">
          Nenhum livro encontrado.{' '}
          <Link href="/livros/novo">Cadastrar um novo livro</Link>
        </p>
      )}
      {resultados.length > 0 && (
        <ul className="lista-add__resultados">
          {resultados.map((l) => (
            <li key={idDe(l)}>
              <button
                type="button"
                className="lista-add__item"
                onClick={() => {
                  onAdicionar(idDe(l))
                  setBusca('')
                }}
                disabled={desabilitado}
              >
                <BookCover livro={l} size="xs" />
                <span>
                  <strong>{l.titulo}</strong>
                  {l.autores?.length > 0 && <em>{l.autores.join(', ')}</em>}
                </span>
                <Icon name="plus" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
