import Link from 'next/link'
import { Modal } from './Modal'
import { Avatar } from './Avatar'
import { idDe, handleUsuario } from '../utils/dados'

// Lista de usuários (seguidores ou seguindo) a partir dos registros de relação.
export function SeguidoresModal({ aberto, onFechar, titulo, registros, campo }) {
  const usuarios = (registros || [])
    .map((r) => r[campo])
    .filter((u) => u && typeof u === 'object')

  return (
    <Modal titulo={titulo} aberto={aberto} onFechar={onFechar}>
      {usuarios.length === 0 ? (
        <p className="seguidores-modal__vazio">Ninguém por aqui ainda.</p>
      ) : (
        <ul className="seguidores-modal">
          {usuarios.map((u) => (
            <li key={idDe(u)}>
              <Link
                href={`/usuarios/${idDe(u)}`}
                className="seguidores-modal__item"
                onClick={onFechar}
              >
                <Avatar usuario={u} size={38} />
                <span>
                  <strong>{u.nome}</strong>
                  <em>@{handleUsuario(u)}</em>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
