import { useState } from 'react'

// Formulário de cadastro/edição de livro (campos do modelo Livro da API).
export function LivroForm({ livroAtual, onSubmit, onCancelar, textoBotao }) {
  const [titulo, setTitulo] = useState(livroAtual?.titulo ?? '')
  const [autores, setAutores] = useState((livroAtual?.autores || []).join(', '))
  const [isbn, setIsbn] = useState(livroAtual?.isbn ?? '')
  const [editora, setEditora] = useState(livroAtual?.editora ?? '')
  const [ano, setAno] = useState(livroAtual?.ano ?? '')
  const [paginas, setPaginas] = useState(livroAtual?.paginas ?? '')
  const [capaUrl, setCapaUrl] = useState(livroAtual?.capa_url ?? '')
  const [sinopse, setSinopse] = useState(livroAtual?.sinopse ?? '')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (titulo.trim().length < 2) return setErro('Informe o título do livro.')

    const dados = {
      titulo: titulo.trim(),
      autores: autores
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      isbn: isbn.trim(),
      editora: editora.trim(),
      capa_url: capaUrl.trim(),
      sinopse: sinopse.trim(),
    }
    if (ano) dados.ano = Number(ano)
    if (paginas) dados.paginas = Number(paginas)

    setEnviando(true)
    try {
      await onSubmit(dados)
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o livro.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="livro-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="lf-titulo">Título *</label>
        <input
          id="lf-titulo"
          className="input"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="lf-autores">Autores</label>
        <input
          id="lf-autores"
          className="input"
          value={autores}
          onChange={(e) => setAutores(e.target.value)}
          placeholder="Separe por vírgula: Jorge Amado, Clarice Lispector"
        />
      </div>

      <div className="livro-form__linha">
        <div className="field">
          <label htmlFor="lf-editora">Editora</label>
          <input
            id="lf-editora"
            className="input"
            value={editora}
            onChange={(e) => setEditora(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="lf-isbn">ISBN</label>
          <input
            id="lf-isbn"
            className="input"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>
      </div>

      <div className="livro-form__linha">
        <div className="field">
          <label htmlFor="lf-ano">Ano</label>
          <input
            id="lf-ano"
            className="input"
            type="number"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="lf-paginas">Páginas</label>
          <input
            id="lf-paginas"
            className="input"
            type="number"
            value={paginas}
            onChange={(e) => setPaginas(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lf-capa">URL da capa</label>
        <input
          id="lf-capa"
          className="input"
          value={capaUrl}
          onChange={(e) => setCapaUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="field">
        <label htmlFor="lf-sinopse">Sinopse</label>
        <textarea
          id="lf-sinopse"
          className="input"
          rows={4}
          value={sinopse}
          onChange={(e) => setSinopse(e.target.value)}
        />
      </div>

      {erro && <p className="form-error">{erro}</p>}

      <div className="livro-form__actions">
        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? 'Salvando...' : textoBotao || (livroAtual ? 'Salvar' : 'Cadastrar livro')}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn--ghost" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
