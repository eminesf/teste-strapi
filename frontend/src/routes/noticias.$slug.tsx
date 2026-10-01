import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { formatDate, readingTime, strapi } from '#/lib/strapi'
import { BlocksRenderer } from '#/components/blocks'
import { CategoryTag, CmsBadge, CmsImage, NewsCard, OfflineNotice } from '#/components/ui'

export const Route = createFileRoute('/noticias/$slug')({
  loader: async ({ params }) => {
    const [noticia, recentes] = await Promise.all([
      strapi.noticia(params.slug),
      strapi.noticias(4),
    ])
    if (!noticia.data && !noticia.offline) throw notFound()
    return {
      noticia: noticia.data,
      offline: noticia.offline,
      relacionadas: recentes.data.filter((n) => n.slug !== params.slug).slice(0, 3),
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.noticia?.titulo ?? 'Notícia'} — Nexo Studio` },
      { name: 'description', content: loaderData?.noticia?.resumo ?? '' },
    ],
  }),
  component: NoticiaPage,
})

function NoticiaPage() {
  const { noticia, offline, relacionadas } = Route.useLoaderData()

  if (!noticia) {
    return (
      <div className="bg-ink pt-40 pb-24">
        <OfflineNotice />
      </div>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden bg-ink pt-32 pb-40 text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="container-page relative max-w-4xl">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Voltar para notícias
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {noticia.categoria && <CategoryTag>{noticia.categoria}</CategoryTag>}
            <CmsBadge dark />
          </div>
          <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            {noticia.titulo}
          </h1>
          {noticia.resumo && <p className="mt-5 text-lg text-slate-300 sm:text-xl">{noticia.resumo}</p>}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <User className="size-4" />
              {noticia.autor || 'Equipe'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="size-4" />
              {formatDate(noticia.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              {readingTime(noticia.conteudo)} min de leitura
            </span>
          </div>
        </div>
      </section>

      <div className="container-page relative -mt-28 max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-300/60">
          <CmsImage
            image={noticia.capa}
            alt={noticia.titulo}
            seed={noticia.slug}
            format="large"
            className="aspect-[16/8] w-full"
          />
        </div>
      </div>

      <article className="container-page max-w-3xl py-12 text-lg text-slate-600 lg:py-16">
        {offline && <OfflineNotice />}
        <BlocksRenderer blocks={noticia.conteudo} />
      </article>

      {relacionadas.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-20">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Leia também</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((n) => (
                <NewsCard key={n.documentId} noticia={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
