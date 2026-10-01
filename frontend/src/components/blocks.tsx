import type { ReactNode } from 'react'
import type { Block } from '#/lib/strapi'
import { mediaUrl } from '#/lib/strapi'

/** Renderiza o campo "Rich text (Blocks)" do Strapi 5. */
export function BlocksRenderer({ blocks }: { blocks?: Block[] | null }) {
  if (!blocks?.length) return null
  return <>{blocks.map((b, i) => renderBlock(b, i))}</>
}

function renderChildren(children: Block[] = []): ReactNode {
  return children.map((child, i) => {
    if (child.type === 'link') {
      return (
        <a
          key={i}
          href={child.url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-600 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-500"
        >
          {renderChildren(child.children)}
        </a>
      )
    }
    if (child.type === 'list-item') {
      return <li key={i}>{renderChildren(child.children)}</li>
    }
    if (child.type === 'list') {
      return renderBlock(child, i)
    }

    let node: ReactNode = child.text ?? ''
    if (child.code)
      node = <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">{node}</code>
    if (child.bold) node = <strong className="font-bold text-ink">{node}</strong>
    if (child.italic) node = <em>{node}</em>
    if (child.underline) node = <u>{node}</u>
    if (child.strikethrough) node = <s>{node}</s>
    return <span key={i}>{node}</span>
  })
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case 'heading': {
      const level = block.level ?? 2
      const cls =
        level <= 2
          ? 'mt-12 mb-4 text-2xl font-bold text-ink sm:text-3xl'
          : 'mt-8 mb-3 text-xl font-bold text-ink'
      const Tag = `h${Math.min(Math.max(level, 2), 6)}` as 'h2'
      return (
        <Tag key={key} className={cls}>
          {renderChildren(block.children)}
        </Tag>
      )
    }
    case 'list': {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <Tag
          key={key}
          className={`my-6 space-y-2 pl-6 marker:text-brand-500 ${
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'
          }`}
        >
          {renderChildren(block.children)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-8 rounded-r-2xl border-l-4 border-brand-500 bg-brand-50/60 py-4 pr-5 pl-6 text-lg font-medium text-ink italic"
        >
          {renderChildren(block.children)}
        </blockquote>
      )
    case 'code':
      return (
        <pre
          key={key}
          className="my-6 overflow-x-auto rounded-2xl bg-ink p-5 text-sm text-slate-100"
        >
          <code>{block.children?.map((c) => c.text).join('')}</code>
        </pre>
      )
    case 'image': {
      const src = mediaUrl(block.image)
      if (!src) return null
      return (
        <figure key={key} className="my-8">
          <img src={src} alt={block.image?.alternativeText ?? ''} className="w-full rounded-2xl" />
        </figure>
      )
    }
    default:
      return (
        <p key={key} className="my-5 leading-relaxed">
          {renderChildren(block.children)}
        </p>
      )
  }
}
