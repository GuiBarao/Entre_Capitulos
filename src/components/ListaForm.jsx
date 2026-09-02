import { useState } from 'react'

// Formulário de criar/editar lista.
export function ListaForm({ listaAtual, onSubmit, onCancelar }) {
  const [nome, setNome] = useState(listaAtual?.nome ?? '')
  const [descricao, setDescricao] = useState(listaAtual?.descricao ?? '')
  const [publica, setPublica] = useState(listaAtual?.publica ?? true)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (nome.trim().length < 2) return setErro('Dê um nome à lista.')

    setEnviando(true)
    try {
      await onSubmit({ nome: nome.trim(), descricao: descricao.trim(), publica })
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar a lista.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="lista-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="lista-nome">Nome</label>
        <input
          id="lista-nome"
          className="input"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Clássicos que todo leitor deveria conhecer"
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="lista-desc">Descrição</label>
        <textarea
          id="lista-desc"
          className="input"
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Sobre o que é esta lista?"
        />
      </div>

      <label className="lista-form__check">
        <input
          type="checkbox"
          checked={publica}
          onChange={(e) => setPublica(e.target.checked)}
        />
        Lista pública (outras pessoas podem ver)
      </label>

      {erro && <p className="form-error">{erro}</p>}

      <div className="lista-form__actions">
        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? 'Salvando...' : listaAtual ? 'Salvar' : 'Criar lista'}
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
