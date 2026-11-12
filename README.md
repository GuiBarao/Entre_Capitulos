# Entre Capítulos — Front-end

Interface web (Next.js + React) para a rede social de leitores **Entre Capítulos**.

> **Somente telas.** Não há integração com back-end. Todos os dados vêm de uma
> base em memória (`src/mock/seed.js`) servida por uma camada falsa
> (`src/api/resources.js`) com a mesma interface que uma API REST teria.
> As alterações (resenhas, listas, estante, seguir...) funcionam durante a
> sessão e são descartadas ao recarregar a página.

## Stack

- **Next.js 16** (App Router) + **React 19**
- Rotas por pastas em `src/app/`, navegação com `next/link` e `next/navigation`
- Fontes otimizadas com `next/font` e títulos por página com `metadata`
- CSS puro com design tokens em `src/index.css`

## Rodando

```bash
npm install
npm run dev
```

O Next sobe em `http://localhost:3001` (a 3000 fica para a API).

Para entrar, use qualquer e-mail/senha (por exemplo `ana@exemplo.com.br`).
E-mails de exemplo cadastrados: `ana@exemplo.com.br`, `rafael@exemplo.com.br`,
`marina@exemplo.com.br`. Qualquer outro e-mail cai no usuário padrão (Ana).

## Scripts

| Comando           | Descrição                        |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento      |
| `npm run build`   | Build de produção (`.next/`)    |
| `npm run start`   | Serve o build de produção        |
| `npm run lint`    | Lint com oxlint                  |

## Estrutura

```
src/
  app/         Rotas do Next (App Router): layouts, páginas e 404
  api/         Camada de dados falsa (mesma interface de uma API REST)
  components/  Componentes reutilizáveis
  context/     Contexto de "autenticação" (pseudo-sessão em localStorage)
  hooks/       Hooks de dados (catálogo, estante, listas, feed, perfil...)
  layouts/     Shells de página (área autenticada e telas de acesso)
  mock/        Dados de exemplo (seed.js)
  views/       Telas (componentes cliente usados pelas páginas de app/)
  routes/      Guardas de rota (protegida / pública)
  utils/       Utilitários (formatação, decode do pseudo-token)
```

## Telas

- **Acesso**: login e cadastro.
- **Início**: feed de atividades com filtro "Seguindo / Todos".
- **Explorar**: catálogo com busca, "mais bem avaliados", busca de listas e
  cadastro de livro.
- **Livro**: detalhes, média das resenhas, estante (status + progresso),
  escrever/editar/excluir resenha.
- **Minha Estante**: livros por status com progresso de leitura.
- **Listas**: criar, editar, excluir; adicionar e remover livros.
- **Perfil**: bio, stats, abas de estante/resenhas/listas/atividade; seguir
  outros leitores; editar e excluir a própria conta.
