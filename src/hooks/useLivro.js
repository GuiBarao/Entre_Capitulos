import { useCallback, useEffect, useState } from 'react'
import {
  livros as livrosApi,
  resenhas as resenhasApi,
  estantes as estantesApi,
} from '../api/resources'
import { idDe } from '../utils/dados'

// Carrega um livro com suas resenhas e, se houver usuário logado, o registro
// dele na estante e a resenha dele.
export function useLivro(livroId, usuarioId) {
  const [livro, setLivro] = useState(null)
  const [resenhas, setResenhas] = useState([])
  const [minhaEstante, setMinhaEstante] = useState(null)
  const [minhaResenha, setMinhaResenha] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(
    (signal) => {
      if (!livroId) return
      setCarregando(true)
      setErro(null)

      Promise.all([
        livrosApi.buscar(livroId),
        resenhasApi.listar({ signal }).catch(() => []),
        estantesApi.listar({ signal }).catch(() => []),
      ])
        .then(([l, rs, es]) => {
          setLivro(l)
          const doLivro = (rs || []).filter((r) => idDe(r.livro_id) === livroId)
          doLivro.sort(
            (a, b) => new Date(b.criado_em || 0) - new Date(a.criado_em || 0),
          )
          setResenhas(doLivro)
          setMinhaResenha(
            usuarioId ? doLivro.find((r) => idDe(r.usuario_id) === usuarioId) || null : null,
          )
          setMinhaEstante(
            usuarioId
              ? (es || []).find(
                  (e) => idDe(e.livro_id) === livroId && idDe(e.usuario_id) === usuarioId,
                ) || null
              : null,
          )
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setErro(err)
        })
        .finally(() => setCarregando(false))
    },
    [livroId, usuarioId],
  )

  useEffect(() => {
    const controller = new AbortController()
    carregar(controller.signal)
    return () => controller.abort()
  }, [carregar])

  const media =
    resenhas.length > 0
      ? resenhas.reduce((s, r) => s + (r.nota || 0), 0) / resenhas.length
      : null

  return {
    livro,
    resenhas,
    media,
    minhaEstante,
    minhaResenha,
    carregando,
    erro,
    recarregar: () => carregar(),
  }
}
