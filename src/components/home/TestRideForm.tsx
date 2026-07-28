'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

import { CATEGORIES, CATEGORY_IDS, isCategoryId } from '@/data/categories'
import { UNITS } from '@/data/site'
import { waLink } from '@/lib/whatsapp'

interface FormState {
  name: string
  phone: string
  email: string
  product: string
  unit: string
  date: string
}

const FIRST_UNIT = UNITS[0]

const EMPTY: FormState = {
  name: '',
  phone: '',
  email: '',
  product: 'bikes',
  unit: FIRST_UNIT?.id ?? '',
  date: '',
}

const SENT_MESSAGE = 'Agendamento enviado! Falaremos em breve.'

/** yyyy-mm-dd do <input type="date"> → dd/mm/aaaa para a mensagem. */
function toBrDate(value: string): string {
  const [year, month, day] = value.split('-')
  return year && month && day ? `${day}/${month}/${year}` : value
}

/** Data de hoje no fuso do usuário — usada como `min` do campo de data. */
function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Formulário de test ride.
 *
 * Site vitrine, sem backend: o envio monta uma mensagem no WhatsApp da unidade
 * escolhida — que é a ação realmente útil para o visitante e para a loja.
 */
export default function TestRideForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)
  const dateRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | null>(null)

  // `min` é aplicado direto no DOM em vez de virar estado: a data de hoje depende
  // do fuso do visitante, então renderizá-la causaria divergência de hidratação —
  // e mudar estado no corpo do efeito dispararia uma renderização extra à toa.
  useEffect(() => {
    dateRef.current?.setAttribute('min', todayIso())
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const unit = UNITS.find((u) => u.id === form.unit)
    const product = isCategoryId(form.product)
      ? CATEGORIES[form.product].singular
      : form.product

    const lines = [
      'Olá! Quero agendar um test ride gratuito.',
      '',
      `*Nome:* ${form.name}`,
      `*Telefone:* ${form.phone}`,
      ...(form.email ? [`*E-mail:* ${form.email}`] : []),
      `*Interesse:* ${product}`,
      `*Unidade:* ${unit?.name ?? form.unit}`,
      `*Data preferida:* ${toBrDate(form.date)}`,
    ]

    window.open(
      waLink(lines.join('\n'), unit?.whatsapp),
      '_blank',
      'noopener,noreferrer',
    )

    setSent(true)
    timer.current = window.setTimeout(() => {
      setSent(false)
      setForm(EMPTY)
    }, 3500)
  }

  return (
    <form
      className="fform"
      onSubmit={handleSubmit}
      aria-label="Agendamento de test ride"
    >
      <div className="field">
        <label className="flabel" htmlFor="tr-nome">
          Nome Completo
        </label>
        <input
          id="tr-nome"
          name="nome"
          type="text"
          className="finput"
          placeholder="Seu nome completo"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="flabel" htmlFor="tr-telefone">
          Telefone / WhatsApp
        </label>
        <input
          id="tr-telefone"
          name="telefone"
          type="tel"
          inputMode="tel"
          className="finput"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          required
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="flabel" htmlFor="tr-email">
          Email
        </label>
        <input
          id="tr-email"
          name="email"
          type="email"
          className="finput"
          placeholder="seu@email.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>

      <div className="frow">
        <div className="field">
          <label className="flabel" htmlFor="tr-produto">
            Produto
          </label>
          <select
            id="tr-produto"
            name="produto"
            className="fselect"
            value={form.product}
            onChange={(e) => update('product', e.target.value)}
          >
            {CATEGORY_IDS.map((id) => (
              <option key={id} value={id}>
                {CATEGORIES[id].singular}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="flabel" htmlFor="tr-unidade">
            Unidade
          </label>
          <select
            id="tr-unidade"
            name="unidade"
            className="fselect"
            value={form.unit}
            onChange={(e) => update('unit', e.target.value)}
          >
            {UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label className="flabel" htmlFor="tr-data">
          Data Preferida
        </label>
        <input
          id="tr-data"
          name="data"
          type="date"
          className="finput"
          required
          ref={dateRef}
          value={form.date}
          onChange={(e) => update('date', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className={`btn-p fsubmit${sent ? ' ok' : ''}`}
        disabled={sent}
      >
        {sent ? SENT_MESSAGE : 'Agendar Test Ride Gratuito'}
      </button>

      <p className="sr-only" role="status">
        {sent ? `${SENT_MESSAGE} A conversa foi aberta no WhatsApp.` : ''}
      </p>
    </form>
  )
}
