import { Icon } from './Icon'
import { iniciais } from '../utils/dados'

// Avatar circular do usuário: usa foto_url quando houver, senão as iniciais,
// e por fim um ícone genérico.
export function Avatar({ usuario, nome, fotoUrl, size = 40, className = '' }) {
  const nomeFinal = nome ?? usuario?.nome ?? ''
  const foto = fotoUrl ?? usuario?.foto_url ?? ''
  const estilo = { width: size, height: size, fontSize: Math.round(size * 0.38) }

  return (
    <span className={`avatar ${className}`} style={estilo}>
      {foto ? (
        <img src={foto} alt={nomeFinal ? `Foto de ${nomeFinal}` : ''} />
      ) : nomeFinal ? (
        <span className="avatar__initials">{iniciais(nomeFinal)}</span>
      ) : (
        <Icon name="user" size={Math.round(size * 0.5)} />
      )}
    </span>
  )
}
