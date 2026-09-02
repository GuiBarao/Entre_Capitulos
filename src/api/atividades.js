import { atividades as atividadesApi } from './resources'

// A API registra atividades apenas como texto livre (sem referências).
// Gravamos para manter o histórico em /atividades; falhas são silenciosas
// para não atrapalhar a ação principal do usuário.
export function registrarAtividade(usuarioId, tipo, descricao) {
  if (!usuarioId || !tipo || !descricao) return Promise.resolve()
  return atividadesApi.criar({ usuario_id: usuarioId, tipo, descricao }).catch(() => {})
}

export const descricaoAtividade = {
  inicio_leitura: (titulo) => `começou a ler "${titulo}"`,
  fim_leitura: (titulo) => `terminou de ler "${titulo}"`,
  resenha: (titulo) => `escreveu uma resenha de "${titulo}"`,
  lista: (nome) => `criou a lista "${nome}"`,
  seguir: (nome) => `começou a seguir ${nome}`,
  favorito: (titulo) => `favoritou "${titulo}"`,
}
