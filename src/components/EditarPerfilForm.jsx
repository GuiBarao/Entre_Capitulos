import { useState } from 'react'

// Formulário de edição do perfil do usuário logado.
export function EditarPerfilForm({ usuario, onSubmit, onCancelar }) {
  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [bio, setBio] = useState(usuario?.bio ?? '')
  const [cidade, setCidade] = useState(usuario?.cidade ?? '')
  const [fotoUrl, setFotoUrl] = useState(usuario?.foto_url ?? '')
  const [privado, setPrivado] = useState(usuario?.privado ?? false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (nome.trim().length < 2) return setErro('Informe seu nome.')

    setEnviando(true)
    try {
      await onSubmit({
        nome: nome.trim(),
        bio: bio.trim(),
        cidade: cidade.trim(),
        foto_url: fotoUrl.trim(),
        privado,
      })
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o perfil.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="pf-nome">Nome</label>
        <input
          id="pf-nome"
          className="input"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="pf-bio">Bio</label>
        <textarea
          id="pf-bio"
          className="input"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre você e suas leituras"
        />
      </div>

      <div className="field">
        <label htmlFor="pf-cidade">Cidade</label>
        <input
          id="pf-cidade"
          className="input"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Ex.: Maringá, PR"
        />
      </div>

      <div className="field">
        <label htmlFor="pf-foto">URL da foto</label>
        <input
          id="pf-foto"
          className="input"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <label className="perfil-form__check">
        <input
          type="checkbox"
          checked={privado}
          onChange={(e) => setPrivado(e.target.checked)}
        />
        Perfil privado
      </label>

      {erro && <p className="form-error">{erro}</p>}

      <div className="perfil-form__actions">
        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar'}
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
