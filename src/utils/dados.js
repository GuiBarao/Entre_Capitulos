// Utilitários para lidar com os dados da API (campos ref podem vir populados
// como objeto { _id, ... } ou como string de id).

export function idDe(ref) {
  if (!ref) return null
  if (typeof ref === 'string') return ref
  return ref._id ?? null
}

export function mesmoId(a, b) {
  return idDe(a) != null && idDe(a) === idDe(b)
}

const STATUS_ROTULO = {
  quero_ler: 'Quero ler',
  lendo: 'Lendo',
  lido: 'Lido',
  abandonado: 'Abandonado',
}

export function rotuloStatus(status) {
  return STATUS_ROTULO[status] || status
}

export const STATUS_ESTANTE = ['lendo', 'quero_ler', 'lido', 'abandonado']

export function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export function mesAno(data) {
  if (!data) return ''
  const d = new Date(data)
  if (Number.isNaN(d.getTime())) return ''
  return `${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function tempoRelativo(data) {
  if (!data) return ''
  const d = new Date(data)
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `há ${horas} h`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias} d`
  const semanas = Math.floor(dias / 7)
  if (semanas < 5) return `há ${semanas} sem`
  const meses = Math.floor(dias / 30)
  if (meses < 12) return `há ${meses} m`
  return `há ${Math.floor(dias / 365)} a`
}
