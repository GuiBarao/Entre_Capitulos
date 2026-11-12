// Wrappers finos sobre os endpoints REST da API do EntreCapitulos.
// A API expõe CRUD completo por recurso; a leitura (GET) é pública e
// escrita (POST/PUT/DELETE) exige token JWT.

import { api } from './client'

// -------------------------------------------------------------------------- //
// Autenticação / usuários                                                     //
// -------------------------------------------------------------------------- //

export const auth = {
  login: (email, senha) => api.post('/usuarios/login', { email, senha }, { auth: false }),
  registrar: (dados) => api.post('/usuarios', dados, { auth: false }),
}

export const usuarios = {
  buscar: (id) => api.get(`/usuarios/${id}`, { auth: false }),
  atualizar: (id, dados) => api.put(`/usuarios/${id}`, dados),
  excluir: (id) => api.del(`/usuarios/${id}`),
}

// -------------------------------------------------------------------------- //
// Livros                                                                      //
// -------------------------------------------------------------------------- //

export const livros = {
  listar: (options) => api.get('/livros', { ...options, auth: false }),
  buscar: (id) => api.get(`/livros/${id}`, { auth: false }),
  criar: (dados) => api.post('/livros', dados),
  atualizar: (id, dados) => api.put(`/livros/${id}`, dados),
  excluir: (id) => api.del(`/livros/${id}`),
}

// -------------------------------------------------------------------------- //
// Estantes (status de leitura do usuário)                                     //
// -------------------------------------------------------------------------- //

export const estantes = {
  listar: (options) => api.get('/estantes', { ...options, auth: false }),
  buscar: (id) => api.get(`/estantes/${id}`, { auth: false }),
  criar: (dados) => api.post('/estantes', dados),
  atualizar: (id, dados) => api.put(`/estantes/${id}`, dados),
  excluir: (id) => api.del(`/estantes/${id}`),
}

// -------------------------------------------------------------------------- //
// Resenhas                                                                    //
// -------------------------------------------------------------------------- //

export const resenhas = {
  listar: (options) => api.get('/resenhas', { ...options, auth: false }),
  buscar: (id) => api.get(`/resenhas/${id}`, { auth: false }),
  criar: (dados) => api.post('/resenhas', dados),
  atualizar: (id, dados) => api.put(`/resenhas/${id}`, dados),
  excluir: (id) => api.del(`/resenhas/${id}`),
}

// -------------------------------------------------------------------------- //
// Listas e livros das listas                                                  //
// -------------------------------------------------------------------------- //

export const listas = {
  listar: (options) => api.get('/listas', { ...options, auth: false }),
  buscar: (id) => api.get(`/listas/${id}`, { auth: false }),
  criar: (dados) => api.post('/listas', dados),
  atualizar: (id, dados) => api.put(`/listas/${id}`, dados),
  excluir: (id) => api.del(`/listas/${id}`),
}

export const livroListas = {
  listar: (options) => api.get('/livro-listas', { ...options, auth: false }),
  criar: (dados) => api.post('/livro-listas', dados),
  excluir: (id) => api.del(`/livro-listas/${id}`),
}

// -------------------------------------------------------------------------- //
// Seguidores                                                                  //
// -------------------------------------------------------------------------- //

export const seguidores = {
  listar: (options) => api.get('/usuarios-seguidores', { ...options, auth: false }),
  criar: (dados) => api.post('/usuarios-seguidores', dados),
  excluir: (id) => api.del(`/usuarios-seguidores/${id}`),
}

// -------------------------------------------------------------------------- //
// Feed de atividades                                                          //
// -------------------------------------------------------------------------- //

export const atividades = {
  listar: (options) => api.get('/atividades', { ...options, auth: false }),
  criar: (dados) => api.post('/atividades', dados),
  excluir: (id) => api.del(`/atividades/${id}`),
}
