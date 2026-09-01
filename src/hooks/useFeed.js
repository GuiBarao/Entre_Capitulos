import { useEffect, useState } from 'react'
import {
  resenhas as resenhasApi,
  estantes as estantesApi,
  listas as listasApi,
  livroListas as livroListasApi,
} from '../api/resources'
import { idDe } from '../utils/dados'

// A API só guarda atividades como texto livre, sem referências a livro/lista.
// Para reproduzir o feed do protótipo (com capas, notas e listas), montamos
// as atividades a partir das resenhas, estantes e listas mais recentes.

function tempo(data) {
  const t = data ? new Date(data).getTime() : 0
  return Number.isNaN(t) ? 0 : t
}

export function useFeed({ limite = 30 } = {}) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    setCarregando(true)
    setErro(null)

    Promise.all([
      resenhasApi.listar({ signal }),
      estantesApi.listar({ signal }),
      listasApi.listar({ signal }),
      livroListasApi.listar({ signal }).catch(() => []),
    ])
      .then(([resenhas, estantes, listas, livroListas]) => {
        const capasPorLista = new Map()
        for (const rel of livroListas || []) {
          const listaId = idDe(rel.lista_id)
          if (!listaId) continue
          const arr = capasPorLista.get(listaId) || []
          if (rel.livro_id) arr.push(rel.livro_id)
          capasPorLista.set(listaId, arr)
        }

        const atividades = []

        for (const r of resenhas || []) {
          if (!r.livro_id) continue
          atividades.push({
            id: `resenha-${r._id}`,
            tipo: 'resenha',
            usuario: r.usuario_id,
            livro: r.livro_id,
            nota: r.nota,
            texto: r.texto,
            spoiler: r.spoiler,
            data: r.criado_em,
          })
        }

        for (const e of estantes || []) {
          if (!e.livro_id) continue
          if (e.status === 'lido') {
            atividades.push({
              id: `fim-${e._id}`,
              tipo: 'fim_leitura',
              usuario: e.usuario_id,
              livro: e.livro_id,
              data: e.data_conclusao,
            })
          } else if (e.status === 'lendo' && e.data_inicio) {
            atividades.push({
              id: `inicio-${e._id}`,
              tipo: 'inicio_leitura',
              usuario: e.usuario_id,
              livro: e.livro_id,
              progresso: e.progresso,
              data: e.data_inicio,
            })
          }
        }

        for (const l of listas || []) {
          if (l.publica === false) continue
          const livros = capasPorLista.get(idDe(l)) || []
          atividades.push({
            id: `lista-${l._id}`,
            tipo: 'lista',
            usuario: l.usuario_id,
            lista: l,
            livros,
            totalLivros: livros.length,
            data: l.criado_em,
          })
        }

        atividades.sort((a, b) => tempo(b.data) - tempo(a.data))
        setItens(atividades.slice(0, limite))
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setErro(err)
      })
      .finally(() => setCarregando(false))

    return () => controller.abort()
  }, [limite])

  return { itens, carregando, erro }
}
