import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Hexagon, Camera, Briefcase, Menu, X, Play } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Início' },
  { to: '/noticias', label: 'Notícias' },
  { to: '/contato', label: 'Contato' },
] as const

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lg shadow-brand-500/30">
        <Hexagon className="size-5" strokeWidth={2.5} />
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}
      >
        Nexo<span className="text-brand-500">Studio</span>
      </span>
    </Link>
  )
}

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !transparent || scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Logo light={!solid} />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                solid
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              activeProps={{
                className: solid ? '!text-brand-600 bg-brand-50' : '!text-white bg-white/15',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/contato"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5 hover:bg-brand-500"
          >
            Solicitar orçamento
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className={`rounded-lg p-2 md:hidden ${solid ? 'text-ink' : 'text-white'}`}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="container-page flex flex-col gap-1 pb-5 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              activeProps={{ className: '!text-brand-600 bg-brand-50' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-slate-400">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm leading-relaxed">
            Estratégia, design e tecnologia para empresas que querem crescer no digital.
          </p>
          <div className="mt-6 flex gap-3">
            {[Camera, Briefcase, Play].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid size-10 place-items-center rounded-full bg-white/5 text-slate-300 transition hover:bg-brand-600 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Navegação</h4>
          <ul className="mt-4 space-y-3">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contato</h4>
          <ul className="mt-4 space-y-3">
            <li>contato@nexostudio.com.br</li>
            <li>(11) 4002-8922</li>
            <li>Av. Paulista, 1000 — São Paulo</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} Nexo Studio. Projeto de demonstração.</p>
          <p>
            Conteúdo gerenciado com <span className="font-semibold text-white">Strapi</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
