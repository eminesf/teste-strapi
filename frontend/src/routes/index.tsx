import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react'
import { strapi } from '#/lib/strapi'
import type { PaginaInicial } from '#/lib/strapi'
import { CmsBadge, CmsImage, NewsCard, OfflineNotice, ServiceIcon } from '#/components/ui'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [pagina, servicos, noticias] = await Promise.all([
      strapi.paginaInicial(),
      strapi.servicos(),
      strapi.noticias(3),
    ])
    return {
      pagina: pagina.data,
      servicos: servicos.data,
      noticias: noticias.data,
      offline: pagina.offline || servicos.offline || noticias.offline,
    }
  },
  component: Home,
})

const FALLBACK: PaginaInicial = {
  heroEtiqueta: 'Nova experiência digital',
  heroTitulo: 'Transformamos ideias em experiências digitais memoráveis',
  heroSubtitulo:
    'Estratégia, design e tecnologia trabalhando juntos para levar a sua empresa ao próximo nível.',
  botaoTexto: 'Fale com a gente',
  secaoTitulo: 'Soluções completas para o seu negócio',
  secaoSubtitulo: 'Cadastre seus serviços no Strapi e eles aparecem aqui automaticamente.',
}

const STATS = [
  { value: '+250', label: 'Projetos entregues' },
  { value: '98%', label: 'Clientes satisfeitos' },
  { value: '12', label: 'Anos de mercado' },
  { value: '24/7', label: 'Suporte e monitoramento' },
]

const STEPS = [
  { n: '01', title: 'Acesse o painel', text: 'Entre no Strapi com seu usuário e senha.' },
  { n: '02', title: 'Edite o conteúdo', text: 'Altere textos, imagens ou crie novas notícias.' },
  { n: '03', title: 'Publique', text: 'Clique em “Publicar” e o site se atualiza na hora.' },
]

function Home() {
  const { pagina, servicos, noticias, offline } = Route.useLoaderData()
  const hero = pagina ?? FALLBACK

  return (
    <>
      {/* HERO — conteúdo do single type "Página Inicial" */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-24 text-white lg:pt-40 lg:pb-32">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute -top-40 -left-40 size-[40rem] rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 size-[36rem] rounded-full bg-violet-600/25 blur-3xl" />

        <div className="container-page relative grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              {hero.heroEtiqueta && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-200">
                  <Sparkles className="size-4" />
                  {hero.heroEtiqueta}
                </span>
              )}
              <CmsBadge dark label="Editável no Strapi" />
            </div>

            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {hero.heroTitulo}
            </h1>
            {hero.heroSubtitulo && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                {hero.heroSubtitulo}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contato"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-semibold shadow-xl shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
              >
                {hero.botaoTexto || 'Fale com a gente'}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/noticias"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                <PlayCircle className="size-5" />
                Ver novidades
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['bg-brand-400', 'bg-violet-400', 'bg-sky-400', 'bg-emerald-400'].map((c, i) => (
                  <span
                    key={i}
                    className={`grid size-10 place-items-center rounded-full border-2 border-ink text-sm font-bold text-ink ${c}`}
                  >
                    {['A', 'M', 'R', 'J'][i]}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-white">+250 empresas</span> confiam no nosso
                trabalho
              </p>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-500/40 to-violet-500/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <CmsImage
                image={hero.heroImagem}
                alt={hero.heroTitulo}
                seed="hero"
                format="large"
                className="aspect-[4/3] w-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-2xl border border-slate-100 bg-white p-4 text-ink shadow-2xl sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold">Conteúdo publicado</p>
                  <p className="text-xs text-slate-500">Atualizado pelo Strapi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 -mt-12">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-xl shadow-slate-200/60 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-6 py-8 text-center">
                <p className="text-3xl font-extrabold text-ink sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {offline && (
        <div className="container-page mt-16">
          <OfflineNotice />
        </div>
      )}

      {/* SERVIÇOS — coleção "Serviço" */}
      <section id="servicos" className="py-24 lg:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <CmsBadge />
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {hero.secaoTitulo || FALLBACK.secaoTitulo}
            </h2>
            {(hero.secaoSubtitulo || FALLBACK.secaoSubtitulo) && (
              <p className="mt-4 text-lg text-slate-500">
                {hero.secaoSubtitulo || FALLBACK.secaoSubtitulo}
              </p>
            )}
          </div>

          {servicos.length > 0 ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {servicos.map((s) => (
                <article
                  key={s.documentId}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/60"
                >
                  {s.imagem && (
                    <CmsImage
                      image={s.imagem}
                      alt={s.titulo}
                      format="small"
                      className="-mx-8 -mt-8 mb-8 aspect-[16/9] w-[calc(100%+4rem)] max-w-none"
                    />
                  )}
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lg shadow-brand-500/25 transition group-hover:scale-110">
                    <ServiceIcon name={s.icone} className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-ink">{s.titulo}</h3>
                  <p className="mt-3 leading-relaxed text-slate-500">{s.descricao}</p>
                </article>
              ))}
            </div>
          ) : (
            !offline && (
              <p className="mt-12 text-center text-slate-400">
                Nenhum serviço publicado ainda. Cadastre o primeiro no painel do Strapi.
              </p>
            )
          )}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="container-page grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
              Autonomia total
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Seu time atualiza o site sem depender de programador
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-500">
              Todo o conteúdo marcado com o selo <strong className="text-brand-600">Strapi</strong>{' '}
              nesta página pode ser alterado por um painel simples e intuitivo.
            </p>
          </div>
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-3xl font-extrabold text-brand-200">{step.n}</span>
                <div>
                  <h3 className="font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-slate-500">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ÚLTIMAS NOTÍCIAS — coleção "Notícia" */}
      <section className="py-24 lg:py-32">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <CmsBadge />
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Últimas notícias
              </h2>
            </div>
            <Link
              to="/noticias"
              className="group inline-flex items-center gap-2 font-semibold text-brand-600"
            >
              Ver todas
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          {noticias.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((n) => (
                <NewsCard key={n.documentId} noticia={n} />
              ))}
            </div>
          ) : (
            !offline && (
              <p className="mt-12 text-slate-400">Nenhuma notícia publicada ainda.</p>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 lg:pb-32">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-600 px-8 py-16 text-center text-white shadow-2xl shadow-brand-600/30 sm:px-16">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                Pronto para tirar seu projeto do papel?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Conte para a gente o que você precisa. Respondemos em até 24 horas úteis.
              </p>
              <Link
                to="/contato"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-brand-700 shadow-lg transition hover:-translate-y-0.5"
              >
                Entrar em contato
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
