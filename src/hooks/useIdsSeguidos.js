import { useEffect, useState } from 'react'
import { seguidores as seguidoresApi } from '../api/resources'
import { idDe } from '../utils/dados'

// Conjunto de ids dos usuários que `usuarioId` segue.
export function useIdsSeguidos(usuarioId) {
  const [ids, setIds] = useState(() => new Set())
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!usuarioId) {
      setIds(new Set())
      setCarregando(false)
      return
    }
    const controller = new AbortController()
    setCarregando(true)
    seguidoresApi
      .listar({ signal: controller.signal })
      .then((rels) => {
        const set = new Set()
        for (const r of rels || []) {
          if (idDe(r.seguidor_id) === usuarioId) set.add(idDe(r.seguido_id))
        }
        setIds(set)
      })
      .catch(() => {})
      .finally(() => setCarregando(false))
    return () => controller.abort()
  }, [usuarioId])

  return { ids, carregando }
}
