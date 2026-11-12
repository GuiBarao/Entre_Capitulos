# Entre Capítulos — Front-end

Interface web (Next.js + React) para a rede social de leitores **Entre Capítulos**.
Consome a API REST do projeto `EntreCapitulos` (pasta `back/`).

## Stack

- **Next.js 16** (App Router) + **React 19**
- Rotas por pastas em `src/app/`, navegação com `next/link` e `next/navigation`
- Fontes otimizadas com `next/font` e títulos por página com `metadata`
- `fetch` encapsulado em `src/api/` (sem dependências extras de HTTP)
- CSS puro com design tokens em `src/index.css`

## Pré-requisitos

- Node.js 20.9+
- A API `EntreCapitulos` rodando em `http://localhost:3000`
  (com o MongoDB ativo). Veja o README da API.

## Rodando

Em um terminal, suba a API (pasta `back/`):

```bash
npm install
npm run dev
```

Em outro terminal, suba o front (esta pasta):

```bash
npm install
npm run dev
```

O Next sobe em `http://localhost:3001` (a 3000 fica para a API). As chamadas
para `/api/*` são repassadas pelo Next (`rewrites` em `next.config.mjs`) para o
endereço em `API_URL` (padrão `http://localhost:3000`, veja `.env.example`),
evitando problemas de CORS.

Na primeira vez, crie uma conta em **Criar conta** — os dados ficam salvos no
MongoDB.

## Usuários de teste

Estes usuários são pré-cadastrados automaticamente quando a API sobe
(caso ainda não existam no banco):

| Nome | E-mail | Senha | Perfil |
|---|---|---|---|
| Ana Beatriz Silva | `ana@entrecapitulos.com` | `senha123` | Leitor (perfil público) |
| Rafael Nunes | `rafael@entrecapitulos.com` | `senha123` | Leitor (perfil privado) |

Todos os usuários têm o mesmo papel (leitor): cada um só pode editar e excluir
o que é seu (estante, resenhas, listas, perfil).

## Scripts

| Comando           | Descrição                        |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento      |
| `npm run build`   | Build de produção (`.next/`)     |
| `npm run start`   | Serve o build de produção        |
| `npm run lint`    | Lint com oxlint                  |

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


## Estrutura

```
src/
  app/         Rotas do Next (App Router): layouts, páginas e 404
  api/         Cliente HTTP e wrappers dos endpoints da API
  components/  Componentes reutilizáveis
  context/     Contexto de autenticação (token JWT + usuário logado)
  hooks/       Hooks de dados (catálogo, estante, listas, feed, perfil...)
  layouts/     Shells de página (área autenticada e telas de acesso)
  routes/      Guardas de rota (protegida / pública)
  utils/       Utilitários (ex.: decode de JWT, formatação)
  views/       Telas (componentes cliente usados pelas páginas de app/)
```

## Autenticação

O login (`POST /usuarios/login`) devolve um token JWT que é guardado em
`localStorage` (`ec_token`). O `AuthContext` decodifica o token para obter o
id do usuário e carrega seus dados via `GET /usuarios/:id`. As rotas internas
ficam no grupo `src/app/(app)`, cujo layout usa `<ProtectedRoute>`. Se a API
responder que o token expirou ou é inválido, o cliente HTTP dispara o
encerramento da sessão automaticamente.
