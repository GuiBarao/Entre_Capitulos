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

export const ListasPage = () => (
  <Placeholder titulo="Minhas Listas" descricao="Coleções personalizadas de livros." />
)

export const PerfilPage = () => (
  <Placeholder titulo="Meu Perfil" descricao="Suas informações, resenhas e atividade." />
)
