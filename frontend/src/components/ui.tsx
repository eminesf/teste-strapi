import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BarChart3,
  Cloud,
  Code2,
  Database,
  Heart,
  Headphones,
  ImageIcon,
  Palette,
  Rocket,
  ShieldCheck,
  WifiOff,
} from 'lucide-react'
import type { Noticia, StrapiImage } from '#/lib/strapi'
import { formatDate, mediaUrl } from '#/lib/strapi'

/** Selo que mostra ao cliente quais áreas do site vêm do Strapi. */
export function CmsBadge({ label = 'Conteúdo via Strapi', dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        dark
          ? 'bg-white/10 text-brand-200 ring-white/15'
          : 'bg-brand-50 text-brand-700 ring-brand-100'
      }`}
    >
      <Database className="size-3.5" />
      {label}
    </span>
  )
}

export function OfflineNotice() {
  return (
    <div className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <WifiOff className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-semibold">Não foi possível conectar ao Strapi</p>
        <p className="mt-1 text-sm text-amber-800">
          Verifique se o servidor está rodando e se a variável <code>VITE_STRAPI_URL</code>{' '}
          aponta para ele.
        </p>
      </div>
    </div>
  )
}

const GRADIENTS = [
  'from-brand-500 via-indigo-500 to-violet-500',
  'from-sky-500 via-brand-500 to-indigo-600',
  'from-violet-500 via-fuchsia-500 to-rose-400',
  'from-emerald-400 via-teal-500 to-sky-600',
  'from-amber-400 via-orange-500 to-rose-500',
]

export function CmsImage({
  image,
  alt,
  className = '',
  seed = '',
  format,
}: {
  image?: StrapiImage | null
  alt: string
  className?: string
  seed?: string
  format?: string
}) {
  const src = mediaUrl(image, format)
  if (src) {
    return (
      <img
        src={src}
        alt={image?.alternativeText || alt}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    )
  }

  const g = GRADIENTS[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length]
  return (
    <div className={`grid place-items-center bg-gradient-to-br ${g} ${className}`}>
      <ImageIcon className="size-10 text-white/60" />
    </div>
  )
}

const ICONS = {
  foguete: Rocket,
  grafico: BarChart3,
  escudo: ShieldCheck,
  codigo: Code2,
  pincel: Palette,
  suporte: Headphones,
  nuvem: Cloud,
  coracao: Heart,
}

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = ICONS[(name ?? 'foguete') as keyof typeof ICONS] ?? Rocket
  return <Icon className={className} />
}

export function CategoryTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-brand-700 uppercase shadow-sm backdrop-blur">
      {children}
    </span>
  )
}

export function NewsCard({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      to="/noticias/$slug"
      params={{ slug: noticia.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <CmsImage
          image={noticia.capa}
          alt={noticia.titulo}
          seed={noticia.slug}
          format="medium"
          className="size-full transition duration-500 group-hover:scale-105"
        />
        {noticia.categoria && (
          <div className="absolute top-4 left-4">
            <CategoryTag>{noticia.categoria}</CategoryTag>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time className="text-sm text-slate-400">{formatDate(noticia.publishedAt)}</time>
        <h3 className="mt-2 text-lg leading-snug font-bold text-ink transition group-hover:text-brand-600">
          {noticia.titulo}
        </h3>
        {noticia.resumo && (
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-500">
            {noticia.resumo}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-600">
          Ler matéria
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="container-page relative text-center">
        <p className="text-sm font-semibold tracking-widest text-brand-300 uppercase">{eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{subtitle}</p>
        {children}
      </div>
    </section>
  )
}
