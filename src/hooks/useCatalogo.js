import { useEffect, useMemo, useState } from 'react'
import { livros as livrosApi, resenhas as resenhasApi } from '../api/resources'
import { idDe } from '../utils/dados'

// Carrega o catálogo de livros já enriquecido com a média das notas das
// resenhas (a API não devolve isso pronto).
export function useCatalogo() {
  const [livros, setLivros] = useState([])
  const [resenhas, setResenhas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    setCarregando(true)
    setErro(null)

    Promise.all([
      livrosApi.listar({ signal }),
      resenhasApi.listar({ signal }).catch(() => []),
    ])
      .then(([ls, rs]) => {
        setLivros(ls || [])
        setResenhas(rs || [])
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setErro(err)
      })
      .finally(() => setCarregando(false))

    return () => controller.abort()
  }, [])

  const enriquecidos = useMemo(() => {
    const porLivro = new Map()
    for (const r of resenhas) {
      const lid = idDe(r.livro_id)
      if (!lid) continue
      const atual = porLivro.get(lid) || { soma: 0, qtd: 0 }
      atual.soma += r.nota || 0
      atual.qtd += 1
      porLivro.set(lid, atual)
    }
    return livros.map((l) => {
      const ag = porLivro.get(idDe(l))
      return {
        ...l,
        media: ag && ag.qtd ? ag.soma / ag.qtd : null,
        qtdResenhas: ag ? ag.qtd : 0,
      }
    })
  }, [livros, resenhas])

  return { livros: enriquecidos, carregando, erro }
}
