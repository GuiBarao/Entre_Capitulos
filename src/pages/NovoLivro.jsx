import { useNavigate } from 'react-router-dom'
import { livros as livrosApi } from '../api/resources'
import { LivroForm } from '../components/LivroForm'
import { Icon } from '../components/Icon'
import './livro.css'

export function NovoLivroPage() {
  const navigate = useNavigate()

  async function criar(dados) {
    const livro = await livrosApi.criar(dados)
    if (livro?._id) navigate(`/livros/${livro._id}`, { replace: true })
    else navigate('/explorar')
  }

  return (
    <div className="novo-livro">
      <button type="button" className="livro__voltar" onClick={() => navigate(-1)}>
        <Icon name="chevron-left" size={16} />
        Voltar
      </button>

      <h1 className="page-title">Cadastrar livro</h1>
      <p className="page-subtitle">
        Não encontrou um livro no catálogo? Cadastre para que todos possam usá-lo.
      </p>

      <div className="novo-livro__form">
        <LivroForm onSubmit={criar} onCancelar={() => navigate(-1)} />
      </div>
    </div>
  )
}
