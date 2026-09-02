import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute'
import { InicioPage } from './pages/Inicio'
import { ExplorarPage } from './pages/Explorar'
import { LivroPage } from './pages/Livro'
import { NovoLivroPage } from './pages/NovoLivro'
import { EstantePage } from './pages/Estante'
import { ListasPage } from './pages/Listas'
import { ListaPage } from './pages/Lista'
import { PerfilPage } from './pages/Perfil'
import { EntrarPage } from './pages/Entrar'
import { CadastroPage } from './pages/Cadastro'
import { NaoEncontradaPage } from './pages/NaoEncontrada'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/entrar" element={<EntrarPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="/explorar" element={<ExplorarPage />} />
          <Route path="/livros/novo" element={<NovoLivroPage />} />
          <Route path="/livros/:id" element={<LivroPage />} />
          <Route path="/estante" element={<EstantePage />} />
          <Route path="/listas" element={<ListasPage />} />
          <Route path="/listas/:id" element={<ListaPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/usuarios/:id" element={<PerfilPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NaoEncontradaPage />} />
    </Routes>
  )
}

export default App
