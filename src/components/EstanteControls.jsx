import { useState } from 'react'
import { estantes as estantesApi } from '../api/resources'
import { Icon } from './Icon'
import { STATUS_ESTANTE, rotuloStatus } from '../utils/dados'

// Controles para adicionar/atualizar o livro na estante do usuário logado.
export function EstanteControls({ livroId, usuarioId, registro, onMudou }) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [progresso, setProgresso] = useState(registro?.progresso ?? 0)

  async function definirStatus(status) {
    if (salvando) return
    setSalvando(true)
    setErro('')
    try {
      if (!registro) {
        const corpo = { usuario_id: usuarioId, livro_id: livroId, status }
        if (status === 'lendo') corpo.data_inicio = new Date().toISOString()
        if (status === 'lido') {
          corpo.data_conclusao = new Date().toISOString()
          corpo.progresso = 100
        }
        await estantesApi.criar(corpo)
      } else if (registro.status !== status) {
        const patch = { status }
        if (status === 'lendo' && !registro.data_inicio)
          patch.data_inicio = new Date().toISOString()
        if (status === 'lido') {
          patch.data_conclusao = new Date().toISOString()
          patch.progresso = 100
        }
        await estantesApi.atualizar(registro._id, patch)
      }
      await onMudou?.()
    } catch (err) {
      setErro(err.message || 'Não foi possível atualizar a estante.')
    } finally {
      setSalvando(false)
    }
  }

  async function remover() {
    if (!registro || salvando) return
    setSalvando(true)
    setErro('')
    try {
      await estantesApi.excluir(registro._id)
      await onMudou?.()
    } catch (err) {
      setErro(err.message || 'Não foi possível remover da estante.')
    } finally {
      setSalvando(false)
    }
  }

  async function salvarProgresso() {
    if (!registro || salvando) return
    setSalvando(true)
    setErro('')
    try {
      const valor = Math.max(0, Math.min(100, Number(progresso) || 0))
      const patch = { progresso: valor }
      if (valor >= 100) {
        patch.status = 'lido'
        patch.data_conclusao = new Date().toISOString()
      }
      await estantesApi.atualizar(registro._id, patch)
      await onMudou?.()
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o progresso.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="estante-ctl">
      <span className="estante-ctl__label">
        {registro ? 'Na sua estante' : 'Adicionar à estante'}
      </span>

      <div className="estante-ctl__status">
        {STATUS_ESTANTE.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip${registro?.status === s ? ' is-active' : ''}`}
            onClick={() => definirStatus(s)}
            disabled={salvando}
          >
            {rotuloStatus(s)}
          </button>
        ))}
      </div>

      {registro?.status === 'lendo' && (
        <div className="estante-ctl__progresso">
          <label htmlFor="progresso">Progresso: {progresso}%</label>
          <input
            id="progresso"
            type="range"
            min="0"
            max="100"
            value={progresso}
            onChange={(e) => setProgresso(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn btn--ghost estante-ctl__prog-btn"
            onClick={salvarProgresso}
            disabled={salvando}
          >
            Salvar progresso
          </button>
        </div>
      )}

      {registro && (
        <button
          type="button"
          className="estante-ctl__remover"
          onClick={remover}
          disabled={salvando}
        >
          <Icon name="x" size={14} />
          Remover da estante
        </button>
      )}

      {erro && <p className="form-error">{erro}</p>}
    </div>
  )
}
