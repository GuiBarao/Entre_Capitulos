import { Inter, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import '../index.css'
import '../components/ui.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--fonte-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--fonte-playfair',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Entre Capítulos',
    template: '%s · Entre Capítulos',
  },
  description: 'Rede social de leitores: registre o que leu, descubra o próximo livro e acompanhe seus amigos.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
