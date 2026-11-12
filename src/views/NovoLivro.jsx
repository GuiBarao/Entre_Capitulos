'use client'

import { useRouter } from 'next/navigation'
import { livros as livrosApi } from '../api/resources'
import { LivroForm } from '../components/LivroForm'
import { Icon } from '../components/Icon'
import './livro.css'

export function NovoLivroPage() {
  const router = useRouter()

  async function criar(dados) {
    const livro = await livrosApi.criar(dados)
    if (livro?._id) router.replace(`/livros/${livro._id}`)
    else router.push('/explorar')
  }

  return (
    <div className="novo-livro">
      <button type="button" className="livro__voltar" onClick={() => router.back()}>
        <Icon name="chevron-left" size={16} />
        Voltar
      </button>

      <h1 className="page-title">Cadastrar livro</h1>
      <p className="page-subtitle">
        Não encontrou um livro no catálogo? Cadastre para que todos possam usá-lo.
      </p>

      <div className="novo-livro__form">
        <LivroForm onSubmit={criar} onCancelar={() => router.back()} />
      </div>
    </div>
  )
}
