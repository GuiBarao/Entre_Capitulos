// Páginas temporárias — cada uma será implementada na sua própria tarefa,
// seguindo o protótipo. Mantidas aqui só para a estrutura de rotas funcionar.

function Placeholder({ titulo, descricao }) {
  return (
    <div style={{ padding: '8px 4px' }}>
      <h1 className="page-title">{titulo}</h1>
      <p className="page-subtitle">{descricao}</p>
      <p style={{ marginTop: 24, color: 'var(--text-soft)' }}>Em construção.</p>
    </div>
  )
}

export const InicioPage = () => (
  <Placeholder
    titulo="Início"
    descricao="Acompanhe leituras, resenhas e listas da sua comunidade."
  />
)

export const ExplorarPage = () => (
  <Placeholder titulo="Explorar" descricao="Descubra novos livros, autores e leitores." />
)

export const EstantePage = () => (
  <Placeholder titulo="Minha Estante" descricao="Seus livros por status de leitura." />
)

export const ListasPage = () => (
  <Placeholder titulo="Minhas Listas" descricao="Coleções personalizadas de livros." />
)

export const PerfilPage = () => (
  <Placeholder titulo="Meu Perfil" descricao="Suas informações, resenhas e atividade." />
)

export const LivroPage = () => (
  <Placeholder titulo="Livro" descricao="Detalhes do livro, resenhas e ações." />
)
