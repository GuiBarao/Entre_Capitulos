import { useCallback, useEffect, useState } from 'react'
import { estantes as estantesApi } from '../api/resources'
import { idDe } from '../utils/dados'

// A API não filtra por usuário: busca todas as estantes e filtra no cliente.
export function useEstanteUsuario(usuarioId) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(
    (signal) => {
      if (!usuarioId) {
        setItens([])
        setCarregando(false)
        return
      }
      setCarregando(true)
      setErro(null)
      estantesApi
        .listar({ signal })
        .then((lista) => {
          const doUsuario = (lista || []).filter((e) => idDe(e.usuario_id) === usuarioId)
          setItens(doUsuario)
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

  return { itens, carregando, erro, recarregar: () => carregar() }
}
