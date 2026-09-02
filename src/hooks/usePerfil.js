import { useCallback, useEffect, useState } from 'react'
import {
  usuarios as usuariosApi,
  estantes as estantesApi,
  resenhas as resenhasApi,
  listas as listasApi,
  livroListas as livroListasApi,
  seguidores as seguidoresApi,
} from '../api/resources'
import { idDe } from '../utils/dados'

// Agrega os dados de um perfil: usuário, estante, resenhas, listas e
// relações de seguidores (tudo filtrado no cliente).
export function usePerfil(usuarioId) {
  const [dados, setDados] = useState({
    usuario: null,
    estante: [],
    resenhas: [],
    listas: [],
    seguidores: [],
    seguindo: [],
  })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(
    (signal) => {
      if (!usuarioId) return
      setCarregando(true)
      setErro(null)

      Promise.all([
        usuariosApi.buscar(usuarioId),
        estantesApi.listar({ signal }).catch(() => []),
        resenhasApi.listar({ signal }).catch(() => []),
        listasApi.listar({ signal }).catch(() => []),
        livroListasApi.listar({ signal }).catch(() => []),
        seguidoresApi.listar({ signal }).catch(() => []),
      ])
        .then(([usuario, estantes, resenhas, listas, livroListas, rels]) => {
          const porLista = new Map()
          for (const rel of livroListas || []) {
            const lid = idDe(rel.lista_id)
            if (!lid) continue
            const arr = porLista.get(lid) || []
            arr.push({ relId: rel._id, livro: rel.livro_id })
            porLista.set(lid, arr)
          }

          const minhasResenhas = (resenhas || [])
            .filter((r) => idDe(r.usuario_id) === usuarioId)
            .sort((a, b) => new Date(b.criado_em || 0) - new Date(a.criado_em || 0))

          const minhasListas = (listas || [])
            .filter((l) => idDe(l.usuario_id) === usuarioId)
            .map((l) => {
              const livros = porLista.get(idDe(l)) || []
              return { ...l, livros, total: livros.length }
            })
            .sort((a, b) => new Date(b.criado_em || 0) - new Date(a.criado_em || 0))

          setDados({
            usuario,
            estante: (estantes || []).filter((e) => idDe(e.usuario_id) === usuarioId),
            resenhas: minhasResenhas,
            listas: minhasListas,
            seguidores: (rels || []).filter((r) => idDe(r.seguido_id) === usuarioId),
            seguindo: (rels || []).filter((r) => idDe(r.seguidor_id) === usuarioId),
          })
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

  return { ...dados, carregando, erro, recarregar: () => carregar() }
}
