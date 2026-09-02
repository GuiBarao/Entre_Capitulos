import { useCallback, useEffect, useState } from 'react'
import { listas as listasApi, livroListas as livroListasApi } from '../api/resources'
import { idDe } from '../utils/dados'

// Carrega listas já com os livros de cada uma (a partir de /livro-listas).
// `usuarioId` opcional: filtra apenas as listas daquele usuário.
export function useListas(usuarioId) {
  const [listas, setListas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(
    (signal) => {
      setCarregando(true)
      setErro(null)

      Promise.all([
        listasApi.listar({ signal }),
        livroListasApi.listar({ signal }).catch(() => []),
      ])
        .then(([ls, rels]) => {
          const porLista = new Map()
          for (const rel of rels || []) {
            const lid = idDe(rel.lista_id)
            if (!lid) continue
            const arr = porLista.get(lid) || []
            arr.push({ relId: rel._id, livro: rel.livro_id, adicionado_em: rel.adicionado_em })
            porLista.set(lid, arr)
          }

          let resultado = (ls || []).map((l) => {
            const livros = porLista.get(idDe(l)) || []
            return { ...l, livros, total: livros.length }
          })

          if (usuarioId) {
            resultado = resultado.filter((l) => idDe(l.usuario_id) === usuarioId)
          }

          resultado.sort(
            (a, b) => new Date(b.criado_em || 0) - new Date(a.criado_em || 0),
          )
          setListas(resultado)
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setErro(err)
        })
        .finally(() => setCarregando(false))
    },
    [usuarioId],
  )

  useEffect(() => {
    const controller = new AbortController()
    carregar(controller.signal)
    return () => controller.abort()
  }, [carregar])

  return { listas, carregando, erro, recarregar: () => carregar() }
}
