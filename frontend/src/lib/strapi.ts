export const STRAPI_URL = (
  import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'
).replace(/\/$/, '')

export type StrapiImage = {
  url: string
  alternativeText?: string | null
  width?: number
  height?: number
  formats?: Record<string, { url: string; width: number }>
}

export type PaginaInicial = {
  heroEtiqueta?: string | null
  heroTitulo: string
  heroSubtitulo?: string | null
  heroImagem?: StrapiImage | null
  botaoTexto?: string | null
  secaoTitulo?: string | null
  secaoSubtitulo?: string | null
}

export type Servico = {
  documentId: string
  titulo: string
  descricao: string
  icone?: string | null
  imagem?: StrapiImage | null
}

export type Block = {
  type: string
  level?: number
  format?: 'ordered' | 'unordered'
  url?: string
  image?: StrapiImage
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: Block[]
}

export type Noticia = {
  documentId: string
  titulo: string
  slug: string
  resumo?: string | null
  capa?: StrapiImage | null
  categoria?: string | null
  autor?: string | null
  conteudo?: Block[] | null
  publishedAt: string
}

export function mediaUrl(img?: StrapiImage | null, format?: string) {
  if (!img) return null
  const url = (format && img.formats?.[format]?.url) || img.url
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

async function get<T>(path: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${STRAPI_URL}/api/${path}${qs ? `?${qs}` : ''}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Strapi respondeu ${res.status} em /api/${path}`)
  const json = (await res.json()) as { data: T }
  return json.data
}

/** Nunca derruba a página: se o Strapi estiver fora, devolve `fallback` e sinaliza o erro. */
async function safe<T>(promise: Promise<T | null>, fallback: T): Promise<{ data: T; offline: boolean }> {
  try {
    return { data: (await promise) ?? fallback, offline: false }
  } catch {
    return { data: fallback, offline: true }
  }
}

export const strapi = {
  paginaInicial: () =>
    safe<PaginaInicial | null>(get<PaginaInicial>('pagina-inicial', { populate: '*' }), null),

  servicos: () =>
    safe(
      get<Servico[]>('servicos', {
        populate: '*',
        sort: 'ordem:asc',
        'pagination[pageSize]': '12',
      }),
      [],
    ),

  noticias: (limit = 50) =>
    safe(
      get<Noticia[]>('noticias', {
        populate: '*',
        sort: 'publishedAt:desc',
        'pagination[pageSize]': String(limit),
      }),
      [],
    ),

  noticia: async (slug: string) => {
    const result = await safe(
      get<Noticia[]>('noticias', {
        populate: '*',
        'filters[slug][$eq]': slug,
      }),
      [],
    )
    return { data: result.data[0] ?? null, offline: result.offline }
  },
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function readingTime(blocks?: Block[] | null) {
  const text = JSON.stringify(blocks ?? [])
  const words = text.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
