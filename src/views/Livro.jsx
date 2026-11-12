'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useLivro } from '../hooks/useLivro'
import { livros as livrosApi, resenhas as resenhasApi } from '../api/resources'
import { registrarAtividade, descricaoAtividade } from '../api/atividades'
import { BookCover } from '../components/BookCover'
import { Stars } from '../components/Stars'
import { Icon } from '../components/Icon'
import { EstanteControls } from '../components/EstanteControls'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewCard } from '../components/ReviewCard'
import { Modal } from '../components/Modal'
import { LivroForm } from '../components/LivroForm'
import { idDe } from '../utils/dados'
import './livro.css'

export function LivroPage() {
  const { id } = useParams()
  const router = useRouter()
  const { usuario, ehAdmin } = useAuth()
  const usuarioId = usuario?._id
  const { livro, resenhas, media, minhaEstante, minhaResenha, carregando, erro, recarregar } =
    useLivro(id, usuarioId)

  const [editandoResenha, setEditandoResenha] = useState(false)
  const [editandoLivro, setEditandoLivro] = useState(false)
  const [erroAdmin, setErroAdmin] = useState('')

  if (carregando) {
    return (
      <div className="livro__estado">
        <div className="spinner" />
      </div>
    )
  }

  if (erro || !livro) {
    return (
      <div className="livro__estado">
        <p>{erro?.status === 404 ? 'Livro não encontrado.' : erro?.message || 'Erro ao carregar.'}</p>
        <button type="button" className="btn btn--ghost" onClick={() => router.back()}>
          Voltar
        </button>
      </div>
    )
  }

  const outrasResenhas = resenhas.filter((r) => idDe(r.usuario_id) !== usuarioId)

  async function salvarResenha(dados) {
    if (minhaResenha) {
      await resenhasApi.atualizar(minhaResenha._id, dados)
    } else {
      await resenhasApi.criar({ ...dados, usuario_id: usuarioId, livro_id: id })
      registrarAtividade(usuarioId, 'resenha', descricaoAtividade.resenha(livro.titulo))
    }
    setEditandoResenha(false)
    await recarregar()
  }

  async function excluirResenha() {
    if (!minhaResenha) return
    await resenhasApi.excluir(minhaResenha._id)
    await recarregar()
  }

  // ----- Ações de administrador -----

  async function salvarLivro(dados) {
    await livrosApi.atualizar(id, dados)
    setEditandoLivro(false)
    await recarregar()
  }

  async function excluirLivro() {
    if (!window.confirm(`Excluir "${livro.titulo}" do catálogo? Resenhas e registros de estante desse livro também serão removidos.`)) return
    setErroAdmin('')
    try {
      await livrosApi.excluir(id)
      router.push('/explorar')
    } catch (err) {
      setErroAdmin(err.message || 'Não foi possível excluir o livro.')
    }
  }

  async function moderarResenha(resenha) {
    if (!window.confirm('Excluir esta resenha da comunidade?')) return
    setErroAdmin('')
    try {
      await resenhasApi.excluir(resenha._id)
      await recarregar()
    } catch (err) {
      setErroAdmin(err.message || 'Não foi possível excluir a resenha.')
    }
  }

  const detalhes = [livro.editora, livro.ano, livro.paginas && `${livro.paginas} páginas`]
    .filter(Boolean)
    .join(' • ')

  return (
    <div className="livro">
      <button type="button" className="livro__voltar" onClick={() => router.back()}>
        <Icon name="chevron-left" size={16} />
        Voltar
      </button>

      <header className="livro__header">
        <BookCover livro={livro} size="lg" className="livro__cover" />

        <div className="livro__info">
          <h1 className="livro__titulo">{livro.titulo}</h1>
          {livro.autores?.length > 0 && (
            <p className="livro__autores">{livro.autores.join(', ')}</p>
          )}
          {detalhes && <p className="livro__detalhes">{detalhes}</p>}
          {livro.isbn && <p className="livro__isbn">ISBN {livro.isbn}</p>}

          <div className="livro__avaliacao">
            {media != null ? (
              <>
                <Stars nota={media} size={16} />
                <strong>{media.toFixed(1)}</strong>
                <span>
                  ({resenhas.length} {resenhas.length === 1 ? 'resenha' : 'resenhas'})
                </span>
              </>
            ) : (
              <span className="livro__sem-nota">Ainda sem resenhas</span>
            )}
          </div>

          {ehAdmin && (
            <div className="livro__admin">
              <span className="admin-tag">Administrador</span>
              <button type="button" className="btn btn--ghost" onClick={() => setEditandoLivro(true)}>
                <Icon name="edit" size={15} />
                Editar livro
              </button>
              <button type="button" className="btn btn--ghost livro__admin-excluir" onClick={excluirLivro}>
                <Icon name="x" size={15} />
                Excluir livro
              </button>
            </div>
          )}
          {erroAdmin && <p className="form-error">{erroAdmin}</p>}

          {usuarioId && (
            <EstanteControls
              livroId={id}
              livroTitulo={livro.titulo}
              usuarioId={usuarioId}
              registro={minhaEstante}
              onMudou={recarregar}
            />
          )}
        </div>
      </header>

      {livro.sinopse && (
        <section className="livro__secao">
          <h2>Sinopse</h2>
          <p className="livro__sinopse">{livro.sinopse}</p>
        </section>
      )}

      <section className="livro__secao">
        <h2>Sua resenha</h2>
        {!usuarioId ? (
          <p className="livro__aviso">
            <Link href="/entrar">Entre</Link> para escrever uma resenha.
          </p>
        ) : editandoResenha || !minhaResenha ? (
          <ReviewForm
            resenhaAtual={minhaResenha}
            onSubmit={salvarResenha}
            onCancelar={minhaResenha ? () => setEditandoResenha(false) : undefined}
          />
        ) : (
          <ReviewCard
            resenha={minhaResenha}
            mostrarUsuario={false}
            acoes={
              <>
                <button
                  type="button"
                  className="livro__link-acao"
                  onClick={() => setEditandoResenha(true)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="livro__link-acao livro__link-acao--danger"
                  onClick={excluirResenha}
                >
                  Excluir
                </button>
              </>
            }
          />
        )}
      </section>

      <section className="livro__secao">
        <h2>
          Resenhas da comunidade{' '}
          {outrasResenhas.length > 0 && <span>({outrasResenhas.length})</span>}
        </h2>
        {outrasResenhas.length === 0 ? (
          <p className="livro__aviso">Nenhuma outra resenha ainda.</p>
        ) : (
          <div className="livro__resenhas">
            {outrasResenhas.map((r) => (
              <ReviewCard
                key={r._id}
                resenha={r}
                acoes={
                  ehAdmin ? (
                    <button
                      type="button"
                      className="livro__link-acao livro__link-acao--danger"
                      onClick={() => moderarResenha(r)}
                    >
                      Excluir (moderação)
                    </button>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </section>

      {ehAdmin && (
        <Modal titulo="Editar livro" aberto={editandoLivro} onFechar={() => setEditandoLivro(false)}>
          <LivroForm
            livroAtual={livro}
            onSubmit={salvarLivro}
            onCancelar={() => setEditandoLivro(false)}
          />
        </Modal>
      )}
    </div>
  )
}
