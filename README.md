# Entre Capítulos — Front-end

Interface web (React + Vite) para a rede social de leitores **Entre Capítulos**.
Consome a API REST do projeto [`EntreCapitulos`](../EntreCapitulos).

## Stack

- **React 19** + **Vite**
- **react-router-dom 7** para as rotas
- `fetch` encapsulado em `src/api/` (sem dependências extras de HTTP)
- CSS puro com design tokens em `src/index.css`

## Pré-requisitos

- Node.js 18+
- A API `EntreCapitulos` rodando em `http://localhost:3000`
  (com o MongoDB ativo). Veja o README da API.

## Rodando

```bash
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173`. As chamadas para `/api/*` são
encaminhadas por proxy para o endereço em `VITE_API_URL` (padrão
`http://localhost:3000`, veja `.env.example`), evitando problemas de CORS em
desenvolvimento.

## Funcionalidades

- **Acesso**: cadastro e login (JWT), edição e exclusão da própria conta.
- **Início**: feed de atividades (leituras, resenhas e listas), com filtro
  "Seguindo / Todos".
- **Explorar**: catálogo com busca (título, autor, ISBN, editora, sinopse),
  "mais bem avaliados", busca de listas e cadastro de livro novo.
- **Livro**: detalhes, média das resenhas, adicionar/atualizar na estante
  (status + progresso), escrever/editar/excluir resenha.
- **Minha Estante**: livros por status (lendo / quero ler / lido / abandonado)
  com progresso de leitura.
- **Listas**: criar, editar, excluir; adicionar e remover livros; listas
  públicas/privadas.
- **Perfil**: bio, cidade, stats (lidos, seguidores, seguindo, paginômetro),
  abas de estante/resenhas/listas/atividade; seguir outros leitores.

Cada ação relevante também é registrada em `POST /atividades`.

### Limitações herdadas da API

A API não expõe: listagem/busca de usuários, recuperação de senha, curtidas
ou comentários, nem campo de gênero nos livros (os filtros de categoria do
Explorar fazem correspondência por texto).

## Scripts

| Comando           | Descrição                        |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento      |
| `npm run build`   | Build de produção em `dist/`     |
| `npm run preview` | Pré-visualiza o build            |
| `npm run lint`    | Lint com oxlint                  |

## Estrutura

```
src/
  api/         Cliente HTTP e wrappers dos endpoints da API
  components/  Componentes reutilizáveis
  context/     Contexto de autenticação (token JWT + usuário logado)
  hooks/       Hooks de dados (catálogo, estante, listas, feed, perfil...)
  layouts/     Shells de página (área autenticada e telas de acesso)
  pages/       Telas
  routes/      Guardas de rota (protegida / pública)
  utils/       Utilitários (ex.: decode de JWT, formatação)
```

## Autenticação

O login (`POST /usuarios/login`) devolve um token JWT que é guardado em
`localStorage` (`ec_token`). O `AuthContext` decodifica o token para obter o
id do usuário e carrega seus dados via `GET /usuarios/:id`. Rotas internas
ficam atrás de `<ProtectedRoute>`. Se a API responder que o token expirou ou
é inválido, o cliente HTTP dispara o encerramento da sessão automaticamente.
