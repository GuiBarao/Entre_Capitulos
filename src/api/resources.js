// Camada de dados FALSA (somente telas — sem back-end).
// Mantém a mesma interface que os hooks/páginas esperavam da API real,
// mas tudo é servido de uma base em memória (src/mock/seed.js).

import { ApiError } from './client'
import { db, novoId, USUARIO_ATUAL_ID } from '../mock/seed'

const LATENCIA = 140

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)))

function responder(valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clone(valor)), LATENCIA)
  })
}

function falhar(mensagem, status = 400) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(mensagem, status)), LATENCIA)
  })
}

const acharUsuario = (id) => db.usuarios.find((u) => u._id === id)
const acharLivro = (id) => db.livros.find((l) => l._id === id)
const acharLista = (id) => db.listas.find((l) => l._id === id)

const semSenha = (u) => {
  if (!u) return u
  const { senha_hash: _omitido, ...resto } = u
  return resto
}

const popEstante = (e) => ({
  ...e,
  usuario_id: semSenha(acharUsuario(e.usuario_id)) || e.usuario_id,
  livro_id: acharLivro(e.livro_id) || e.livro_id,
})
const popResenha = (r) => ({
  ...r,
  usuario_id: semSenha(acharUsuario(r.usuario_id)) || r.usuario_id,
  livro_id: acharLivro(r.livro_id) || r.livro_id,
})
const popLista = (l) => ({
  ...l,
  usuario_id: semSenha(acharUsuario(l.usuario_id)) || l.usuario_id,
})
const popLivroLista = (rel) => ({
  ...rel,
  lista_id: acharLista(rel.lista_id) || rel.lista_id,
  livro_id: acharLivro(rel.livro_id) || rel.livro_id,
})
const popSeguidor = (s) => ({
  ...s,
  seguidor_id: semSenha(acharUsuario(s.seguidor_id)) || s.seguidor_id,
  seguido_id: semSenha(acharUsuario(s.seguido_id)) || s.seguido_id,
})
const popAtividade = (a) => ({
  ...a,
  usuario_id: semSenha(acharUsuario(a.usuario_id)) || a.usuario_id,
})

function tokenFalso(id, email) {
  const parte = (o) => btoa(JSON.stringify(o))
  const exp = Math.floor(Date.now() / 1000) + 31536000
  return `${parte({ alg: 'none', typ: 'JWT' })}.${parte({ id, email, exp })}.mock`
}

// -------------------------------------------------------------------------- //
// Autenticação / usuários                                                     //
// -------------------------------------------------------------------------- //

export const auth = {
  login: (email) => {
    const usuario =
      db.usuarios.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) ||
      acharUsuario(USUARIO_ATUAL_ID)
    return responder({ token: tokenFalso(usuario._id, usuario.email) })
  },
  registrar: (dados) => {
    if (db.usuarios.some((u) => u.email.toLowerCase() === String(dados.email).toLowerCase())) {
      return falhar('Email já cadastrado', 409)
    }
    const usuario = {
      _id: novoId('u'),
      nome: dados.nome,
      email: dados.email,
      bio: dados.bio || '',
      cidade: dados.cidade || '',
      foto_url: dados.foto_url || '',
      privado: Boolean(dados.privado),
      criado_em: new Date().toISOString(),
    }
    db.usuarios.push(usuario)
    return responder({ mensagem: 'Usuário criado com sucesso', id: usuario._id })
  },
}

export const usuarios = {
  buscar: (id) => {
    const u = acharUsuario(id)
    return u ? responder(semSenha(u)) : falhar('Usuário não encontrado', 404)
  },
  atualizar: (id, dados) => {
    const u = acharUsuario(id)
    if (!u) return falhar('Usuário não encontrado', 404)
    Object.assign(u, dados)
    return responder(semSenha(u))
  },
  excluir: (id) => {
    const i = db.usuarios.findIndex((u) => u._id === id)
    if (i === -1) return falhar('Usuário não encontrado', 404)
    db.usuarios.splice(i, 1)
    return responder({ mensagem: 'Usuário excluído com sucesso' })
  },
}

// -------------------------------------------------------------------------- //
// CRUD genérico sobre uma coleção da base em memória                          //
// -------------------------------------------------------------------------- //

function colecao(nome, { prefixo, popular, aoCriar }) {
  return {
    listar: () => responder(db[nome].map(popular)),
    buscar: (id) => {
      const item = db[nome].find((x) => x._id === id)
      return item ? responder(popular(item)) : falhar('Registro não encontrado', 404)
    },
    criar: (dados) => {
      const item = {
        _id: novoId(prefixo),
        ...dados,
        ...(aoCriar ? aoCriar(dados) : null),
      }
      db[nome].push(item)
      return responder(popular(item))
    },
    atualizar: (id, dados) => {
      const item = db[nome].find((x) => x._id === id)
      if (!item) return falhar('Registro não encontrado', 404)
      Object.assign(item, dados)
      return responder(popular(item))
    },
    excluir: (id) => {
      const i = db[nome].findIndex((x) => x._id === id)
      if (i === -1) return falhar('Registro não encontrado', 404)
      db[nome].splice(i, 1)
      return responder({ mensagem: 'Registro removido com sucesso' })
    },
  }
}

export const livros = colecao('livros', {
  prefixo: 'l',
  popular: (l) => ({ ...l }),
  aoCriar: () => ({ criado_em: new Date().toISOString() }),
})

export const estantes = colecao('estantes', { prefixo: 'e', popular: popEstante })

export const resenhas = colecao('resenhas', {
  prefixo: 'r',
  popular: popResenha,
  aoCriar: () => ({ criado_em: new Date().toISOString() }),
})

export const listas = colecao('listas', {
  prefixo: 'li',
  popular: popLista,
  aoCriar: () => ({ criado_em: new Date().toISOString() }),
})

export const livroListas = colecao('livroListas', {
  prefixo: 'll',
  popular: popLivroLista,
  aoCriar: () => ({ adicionado_em: new Date().toISOString() }),
})

export const seguidores = colecao('seguidores', {
  prefixo: 's',
  popular: popSeguidor,
  aoCriar: () => ({ criado_em: new Date().toISOString() }),
})

export const atividades = colecao('atividades', {
  prefixo: 'a',
  popular: popAtividade,
  aoCriar: () => ({ criado_em: new Date().toISOString() }),
})
