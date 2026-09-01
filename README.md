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
encaminhadas por proxy para `http://localhost:3000` (configurado em
`vite.config.js`), evitando problemas de CORS em desenvolvimento.

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
  layouts/     Shells de página (área autenticada e telas de acesso)
  pages/       Telas
  routes/      Guardas de rota (protegida / pública)
  utils/       Utilitários (ex.: decode de JWT)
```

## Autenticação

O login (`POST /usuarios/login`) devolve um token JWT que é guardado em
`localStorage` (`ec_token`). O `AuthContext` decodifica o token para obter o
id do usuário e carrega seus dados via `GET /usuarios/:id`. Rotas internas
ficam atrás de `<ProtectedRoute>`.
