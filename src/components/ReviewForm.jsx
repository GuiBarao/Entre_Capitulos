import { useState } from 'react'
import { Stars } from './Stars'

// Formulário de resenha (criar ou editar).
export function ReviewForm({ resenhaAtual, onSubmit, onCancelar }) {
  const [nota, setNota] = useState(resenhaAtual?.nota ?? 0)
  const [texto, setTexto] = useState(resenhaAtual?.texto ?? '')
  const [spoiler, setSpoiler] = useState(resenhaAtual?.spoiler ?? false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (nota < 1) return setErro('Dê uma nota de 1 a 5 estrelas.')
    if (texto.trim().length < 3) return setErro('Escreva um pouco mais sobre o livro.')

    setEnviando(true)
    try {
      await onSubmit({ nota, texto: texto.trim(), spoiler })
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar a resenha.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__row">
        <span className="review-form__label">Sua nota</span>
        <Stars nota={nota} interativa onChange={setNota} size={18} />
      </div>

      <textarea
        className="input review-form__textarea"
        rows={5}
        placeholder="Compartilhe o que achou da obra, seus pensamentos, o que marcou..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <label className="review-form__spoiler">
        <input
          type="checkbox"
          checked={spoiler}
          onChange={(e) => setSpoiler(e.target.checked)}
        />
        Esta resenha contém spoilers
      </label>

      {erro && <p className="form-error">{erro}</p>}

      <div className="review-form__actions">
        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? 'Salvando...' : resenhaAtual ? 'Salvar alterações' : 'Publicar resenha'}
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
