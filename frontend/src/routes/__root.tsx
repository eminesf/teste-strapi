import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { Footer, Header } from '#/components/layout'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nexo Studio — Experiências digitais' },
      {
        name: 'description',
        content: 'Landing page de demonstração com conteúdo gerenciado pelo Strapi.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header transparent />
        <main>{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-ink px-5 pt-24 text-center text-white">
      <div>
        <p className="text-8xl font-extrabold text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-slate-400">O conteúdo que você procura não existe ou foi removido.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-brand-600 px-6 py-3 font-semibold hover:bg-brand-500"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}
