import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowRight, Clock, Newspaper } from 'lucide-react'
import { formatDate, readingTime, strapi } from '#/lib/strapi'
import { CategoryTag, CmsBadge, CmsImage, NewsCard, OfflineNotice, PageHero } from '#/components/ui'

export const Route = createFileRoute('/noticias/')({
  loader: () => strapi.noticias(),
  head: () => ({ meta: [{ title: 'Notícias — Nexo Studio' }] }),
  component: Noticias,
})

function Noticias() {
  const { data: noticias, offline } = Route.useLoaderData()
  const [categoria, setCategoria] = useState<string | null>(null)

  const categorias = useMemo(
    () => [...new Set(noticias.map((n) => n.categoria).filter(Boolean))] as string[],
    [noticias],
  )
  const filtradas = categoria ? noticias.filter((n) => n.categoria === categoria) : noticias
  const [destaque, ...resto] = filtradas

  return (
    <>
      <PageHero
        eyebrow="Blog & Novidades"
        title="Notícias e conteúdos"
        subtitle="Acompanhe as novidades da empresa, tendências do mercado e dicas para o seu negócio."
      >
        <div className="mt-8 flex justify-center">
          <CmsBadge dark label="Todas as matérias são cadastradas no Strapi" />
        </div>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          {offline && <OfflineNotice />}

          {categorias.length > 1 && (
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              {[null, ...categorias].map((c) => (
                <button
                  key={c ?? 'todas'}
                  type="button"
                  onClick={() => setCategoria(c)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    categoria === c
                      ? 'bg-ink text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c ?? 'Todas'}
                </button>
              ))}
            </div>
          )}

          {destaque ? (
            <>
              <Link
                to="/noticias/$slug"
                params={{ slug: destaque.slug }}
                className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-2xl hover:shadow-slate-200 lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <CmsImage
                    image={destaque.capa}
                    alt={destaque.titulo}
                    seed={destaque.slug}
                    format="large"
                    className="size-full transition duration-700 group-hover:scale-105 lg:absolute lg:inset-0"
                  />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                      Destaque
                    </span>
                    {destaque.categoria && <CategoryTag>{destaque.categoria}</CategoryTag>}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <time>{formatDate(destaque.publishedAt)}</time>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {readingTime(destaque.conteudo)} min de leitura
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl leading-tight font-extrabold text-ink transition group-hover:text-brand-600 sm:text-3xl">
                    {destaque.titulo}
                  </h2>
                  {destaque.resumo && (
                    <p className="mt-4 text-lg leading-relaxed text-slate-500">{destaque.resumo}</p>
                  )}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Por {destaque.autor || 'Equipe'}
                    </span>
                    <span className="inline-flex items-center gap-2 font-semibold text-brand-600">
                      Ler matéria
                      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>

              {resto.length > 0 && (
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {resto.map((n) => (
                    <NewsCard key={n.documentId} noticia={n} />
                  ))}
                </div>
              )}
            </>
          ) : (
            !offline && (
              <div className="mx-auto max-w-md py-16 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <Newspaper className="size-8" />
                </span>
                <h2 className="mt-6 text-xl font-bold text-ink">Nenhuma notícia por aqui</h2>
                <p className="mt-2 text-slate-500">
                  Publique uma notícia no painel do Strapi e ela aparecerá nesta página.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  )
}
