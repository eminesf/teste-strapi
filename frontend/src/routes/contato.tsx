import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Camera,
  Briefcase,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Play,
} from 'lucide-react'
import { PageHero } from '#/components/ui'

export const Route = createFileRoute('/contato')({
  head: () => ({ meta: [{ title: 'Contato — Nexo Studio' }] }),
  component: Contato,
})

const CANAIS = [
  { icon: Mail, title: 'E-mail', value: 'contato@nexostudio.com.br', hint: 'Respondemos em até 24h' },
  { icon: Phone, title: 'Telefone', value: '(11) 4002-8922', hint: 'Seg a sex, 9h às 18h' },
  { icon: MessageCircle, title: 'WhatsApp', value: '(11) 99999-0000', hint: 'Atendimento rápido' },
  { icon: MapPin, title: 'Escritório', value: 'Av. Paulista, 1000', hint: 'São Paulo — SP' },
]

const ASSUNTOS = ['Novo projeto', 'Orçamento', 'Suporte', 'Parcerias', 'Outro']

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-ink placeholder:text-slate-400 transition outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100'

function Contato() {
  const [enviado, setEnviado] = useState(false)
  const [assunto, setAssunto] = useState(ASSUNTOS[0])

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Vamos conversar sobre o seu projeto?"
        subtitle="Preencha o formulário ou escolha o canal que preferir. Nosso time vai adorar ouvir sua ideia."
      />

      <section className="relative z-10 -mt-10">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CANAIS.map(({ icon: Icon, title, value, hint }) => (
            <div
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:border-brand-200"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-sm font-semibold text-slate-400">{title}</p>
              <p className="mt-1 font-bold text-ink">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10 lg:col-span-3">
            {enviado ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <span className="grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="size-10" />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold text-ink">Mensagem enviada!</h2>
                <p className="mt-2 max-w-sm text-slate-500">
                  Obrigado pelo contato. (Este formulário é apenas demonstrativo — nenhuma mensagem
                  foi enviada de verdade.)
                </p>
                <button
                  type="button"
                  onClick={() => setEnviado(false)}
                  className="mt-8 rounded-full border border-slate-200 px-6 py-3 font-semibold text-ink hover:bg-slate-50"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setEnviado(true)
                }}
              >
                <h2 className="text-2xl font-extrabold text-ink">Envie uma mensagem</h2>
                <p className="mt-2 text-slate-500">Todos os campos com * são obrigatórios.</p>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold text-ink">Sobre o que vamos falar?</p>
                  <div className="flex flex-wrap gap-2">
                    {ASSUNTOS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAssunto(a)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          assunto === a
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Nome *</span>
                    <input required className={inputCls} placeholder="Seu nome completo" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">E-mail *</span>
                    <input required type="email" className={inputCls} placeholder="voce@empresa.com" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Telefone</span>
                    <input className={inputCls} placeholder="(00) 00000-0000" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Empresa</span>
                    <input className={inputCls} placeholder="Nome da empresa" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-ink">Mensagem *</span>
                    <textarea
                      required
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder="Conte um pouco sobre o seu projeto..."
                    />
                  </label>
                </div>

                <label className="mt-6 flex items-start gap-3 text-sm text-slate-500">
                  <input type="checkbox" required className="mt-0.5 size-4 accent-brand-600" />
                  Concordo com a política de privacidade e autorizo o contato.
                </label>

                <button
                  type="submit"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-4 font-bold text-white shadow-xl shadow-brand-600/25 transition hover:-translate-y-0.5 hover:bg-brand-500 sm:w-auto"
                >
                  Enviar mensagem
                  <Send className="size-4 transition group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white">
              <div className="bg-grid absolute inset-0 opacity-60" />
              <div className="absolute -right-16 -bottom-16 size-56 rounded-full bg-brand-600/40 blur-3xl" />
              <div className="relative">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
                  <Clock className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold">Horário de atendimento</h3>
                <ul className="mt-4 space-y-2 text-slate-300">
                  <li className="flex justify-between">
                    <span>Segunda a sexta</span>
                    <span className="font-semibold text-white">9h — 18h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-semibold text-white">9h — 13h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Domingo</span>
                    <span className="text-slate-500">Fechado</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mapa ilustrativo */}
            <div className="relative h-64 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="absolute top-0 left-1/3 h-full w-6 -skew-x-12 bg-white/90" />
              <div className="absolute top-1/2 left-0 h-6 w-full -rotate-6 bg-white/90" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/40" />
                <span className="relative grid size-12 place-items-center rounded-full bg-brand-600 text-white shadow-xl">
                  <MapPin className="size-6" />
                </span>
              </div>
              <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
                <p className="font-bold text-ink">Nexo Studio</p>
                <p className="text-sm text-slate-500">Av. Paulista, 1000 — Bela Vista, São Paulo</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
              <h3 className="font-bold text-ink">Siga a gente</h3>
              <div className="mt-4 flex gap-3">
                {[Camera, Briefcase, Play].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-brand-600 hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
