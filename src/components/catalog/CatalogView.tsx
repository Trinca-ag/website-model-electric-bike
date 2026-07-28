'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'

import ProductCard from '@/components/product/ProductCard'
import {
  IconClose,
  IconFilter,
  IconGrid,
  IconList,
} from '@/components/ui/Icons'
import Reveal from '@/components/ui/Reveal'
import { CATEGORIES } from '@/data/categories'
import type { CategoryId, Product } from '@/types/product'

const SORT_KEYS = [
  'relevance',
  'price-asc',
  'price-desc',
  'speed-desc',
  'range-desc',
] as const

type SortKey = (typeof SORT_KEYS)[number]

const SORT_OPTIONS: readonly { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Ordem do catálogo' },
  { key: 'price-asc', label: 'Menor Preço' },
  { key: 'price-desc', label: 'Maior Preço' },
  { key: 'speed-desc', label: 'Maior Velocidade' },
  { key: 'range-desc', label: 'Maior Autonomia' },
]

/** `null` = ordem do catálogo, sem reordenar nada. */
const COMPARATORS: Record<
  SortKey,
  ((a: Product, b: Product) => number) | null
> = {
  relevance: null,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'speed-desc': (a, b) => b.speed - a.speed,
  'range-desc': (a, b) => b.range - a.range,
}

interface Band {
  readonly key: string
  readonly label: string
  readonly test: (p: Product) => boolean
}

const SPEED_BANDS: readonly Band[] = [
  { key: 's1', label: 'Até 30 km/h', test: (p) => p.speed <= 30 },
  { key: 's2', label: '31–60 km/h', test: (p) => p.speed > 30 && p.speed <= 60 },
  { key: 's3', label: '61–100 km/h', test: (p) => p.speed > 60 },
]

// A unidade sai do rótulo: pranchas medem autonomia em minutos, o resto em km.
const RANGE_BANDS: readonly Band[] = [
  { key: 'r1', label: 'Até 40', test: (p) => p.range <= 40 },
  { key: 'r2', label: '41–70', test: (p) => p.range > 40 && p.range <= 70 },
  { key: 'r3', label: '71–120', test: (p) => p.range > 70 },
]

function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value)
}

function toggle(list: readonly string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value]
}

interface CatalogViewProps {
  /** Já filtrada por categoria no servidor. */
  products: readonly Product[]
  /** Pills renderizadas no servidor e injetadas na coluna principal. */
  pills: ReactNode
}

/**
 * Catálogo interativo: filtros, ordenação e alternância grade/lista.
 *
 * Categoria não é estado — cada uma tem rota estática própria, e a lista que
 * chega aqui já vem filtrada. O que resta é só aquilo que o servidor não tem
 * como saber de antemão.
 */
export default function CatalogView({ products, pills }: CatalogViewProps) {
  const uid = useId()

  const [activeLines, setActiveLines] = useState<readonly string[]>([])
  const [activeSpeeds, setActiveSpeeds] = useState<readonly string[]>([])
  const [activeRanges, setActiveRanges] = useState<readonly string[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sort, setSort] = useState<SortKey>('relevance')
  const [listView, setListView] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // --- Opções derivadas -------------------------------------------------

  const lineOptions = useMemo(() => {
    const groups = new Map<string, { cat: CategoryId; line: string; n: number }>()
    for (const p of products) {
      const key = `${p.cat}::${p.line}`
      const found = groups.get(key)
      if (found) found.n += 1
      else groups.set(key, { cat: p.cat, line: p.line, n: 1 })
    }

    // "Linha G" e "Linha R" existem em mais de uma categoria: no catálogo
    // completo o rótulo ganha a categoria para não virarem opções idênticas.
    const repeated = new Map<string, number>()
    for (const g of groups.values()) {
      repeated.set(g.line, (repeated.get(g.line) ?? 0) + 1)
    }

    return [...groups.entries()].map(([key, g], i) => ({
      key,
      inputId: `${uid}-line-${i}`,
      label:
        (repeated.get(g.line) ?? 0) > 1
          ? `${g.line} · ${CATEGORIES[g.cat].short}`
          : g.line,
      count: g.n,
    }))
  }, [products, uid])

  const rangeSuffix = useMemo(() => {
    const units = [...new Set(products.map((p) => p.rangeUnit))]
    const only = units.length === 1 ? units[0] : undefined
    return only ? ` ${only}` : ''
  }, [products])

  const speedOptions = useMemo(
    () =>
      SPEED_BANDS.map((b, i) => ({
        key: b.key,
        inputId: `${uid}-speed-${i}`,
        label: b.label,
        count: products.filter(b.test).length,
      })),
    [products, uid],
  )

  const rangeOptions = useMemo(
    () =>
      RANGE_BANDS.map((b, i) => ({
        key: b.key,
        inputId: `${uid}-range-${i}`,
        label: `${b.label}${rangeSuffix}`,
        count: products.filter(b.test).length,
      })),
    [products, uid, rangeSuffix],
  )

  // --- Lista visível ----------------------------------------------------

  const visible = useMemo(() => {
    const min = Number.parseFloat(priceMin)
    const max = Number.parseFloat(priceMax)
    const lo = Number.isFinite(min) ? min : 0
    const hi = Number.isFinite(max) ? max : Number.POSITIVE_INFINITY

    const speedTests = SPEED_BANDS.filter((b) =>
      activeSpeeds.includes(b.key),
    ).map((b) => b.test)
    const rangeTests = RANGE_BANDS.filter((b) =>
      activeRanges.includes(b.key),
    ).map((b) => b.test)

    const filtered = products.filter((p) => {
      if (activeLines.length && !activeLines.includes(`${p.cat}::${p.line}`)) {
        return false
      }
      if (p.price < lo || p.price > hi) return false
      if (speedTests.length && !speedTests.some((t) => t(p))) return false
      if (rangeTests.length && !rangeTests.some((t) => t(p))) return false
      return true
    })

    // `filtered` já é um array novo, mas a cópia deixa explícito que
    // PRODUCTS (e a prop `products`) nunca são reordenados no lugar.
    const comparator = COMPARATORS[sort]
    return comparator ? [...filtered].sort(comparator) : filtered
  }, [products, activeLines, activeSpeeds, activeRanges, priceMin, priceMax, sort])

  const activeCount =
    activeLines.length +
    activeSpeeds.length +
    activeRanges.length +
    (priceMin.trim() ? 1 : 0) +
    (priceMax.trim() ? 1 : 0)

  function clearFilters() {
    setActiveLines([])
    setActiveSpeeds([])
    setActiveRanges([])
    setPriceMin('')
    setPriceMax('')
  }

  function closeDrawer() {
    setDrawerOpen(false)
    toggleRef.current?.focus()
  }

  // --- Gaveta de filtros (mobile) ---------------------------------------

  // Abaixo de 900px o aside vira gaveta. Saber disso no cliente permite marcar
  // o painel fechado como `inert` — fora dele o painel está sempre visível.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => {
      setDrawerMode(mq.matches)
      if (!mq.matches) setDrawerOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div className="layout">
      <aside
        id="catalog-filters"
        className={`filters${drawerOpen ? ' open' : ''}`}
        aria-label="Filtros do catálogo"
        inert={drawerMode && !drawerOpen ? true : undefined}
      >
        <div className="filter-header">
          <h2 className="filter-title">FILTROS</h2>
          <div className="filter-header-acts">
            <button type="button" className="filter-clear" onClick={clearFilters}>
              Limpar
            </button>
            <button
              type="button"
              className="filters-close"
              onClick={closeDrawer}
              aria-label="Fechar filtros"
              ref={closeRef}
            >
              <IconClose size={22} />
            </button>
          </div>
        </div>

        <fieldset className="filter-group">
          <legend className="filter-group-title">Linha</legend>
          <div className="filter-opts scroll">
            {lineOptions.map((opt) => (
              <div className="fopt" key={opt.key}>
                <input
                  type="checkbox"
                  id={opt.inputId}
                  checked={activeLines.includes(opt.key)}
                  onChange={() =>
                    setActiveLines((cur) => toggle(cur, opt.key))
                  }
                />
                <label htmlFor={opt.inputId}>
                  {opt.label} <span className="fopt-count">{opt.count}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-group-title">Preço</legend>
          <div className="price-inputs">
            <input
              type="number"
              className="price-input"
              placeholder="Min R$"
              aria-label="Preço mínimo em reais"
              inputMode="numeric"
              min={0}
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <input
              type="number"
              className="price-input"
              placeholder="Máx R$"
              aria-label="Preço máximo em reais"
              inputMode="numeric"
              min={0}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-group-title">Velocidade Máxima</legend>
          <div className="filter-opts">
            {speedOptions.map((opt) => (
              <div className="fopt" key={opt.key}>
                <input
                  type="checkbox"
                  id={opt.inputId}
                  checked={activeSpeeds.includes(opt.key)}
                  onChange={() =>
                    setActiveSpeeds((cur) => toggle(cur, opt.key))
                  }
                />
                <label htmlFor={opt.inputId}>
                  {opt.label} <span className="fopt-count">{opt.count}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-group-title">Autonomia</legend>
          <div className="filter-opts">
            {rangeOptions.map((opt) => (
              <div className="fopt" key={opt.key}>
                <input
                  type="checkbox"
                  id={opt.inputId}
                  checked={activeRanges.includes(opt.key)}
                  onChange={() =>
                    setActiveRanges((cur) => toggle(cur, opt.key))
                  }
                />
                <label htmlFor={opt.inputId}>
                  {opt.label} <span className="fopt-count">{opt.count}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </aside>

      <button
        type="button"
        className={`filters-backdrop${drawerOpen ? ' on' : ''}`}
        onClick={closeDrawer}
        tabIndex={-1}
        aria-hidden
      />

      <div className="products-main">
        {pills}

        <h2 className="sr-only">Produtos</h2>

        <div className="sort-bar">
          <div className="result-count">
            <button
              type="button"
              className="filter-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="catalog-filters"
              ref={toggleRef}
            >
              <IconFilter size={14} />
              Filtros
              {activeCount > 0 ? (
                <span className="badge">{activeCount}</span>
              ) : null}
            </button>
            <span className="result-count-text" aria-live="polite">
              {visible.length}{' '}
              {visible.length === 1
                ? 'produto encontrado'
                : 'produtos encontrados'}
            </span>
          </div>

          <div className="sort-controls">
            <label className="sr-only" htmlFor={`${uid}-sort`}>
              Ordenar por
            </label>
            <select
              id={`${uid}-sort`}
              className="sort-select"
              value={sort}
              onChange={(e) => {
                if (isSortKey(e.target.value)) setSort(e.target.value)
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="view-btns">
              <button
                type="button"
                className={`view-btn${listView ? '' : ' on'}`}
                onClick={() => setListView(false)}
                aria-label="Visualizar em grade"
                aria-pressed={!listView}
                title="Grade"
              >
                <IconGrid size={16} />
              </button>
              <button
                type="button"
                className={`view-btn${listView ? ' on' : ''}`}
                onClick={() => setListView(true)}
                aria-label="Visualizar em lista"
                aria-pressed={listView}
                title="Lista"
              >
                <IconList size={16} />
              </button>
            </div>
          </div>
        </div>

        {visible.length > 0 ? (
          <Reveal className={`pgrid stg${listView ? ' list' : ''}`}>
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                list={listView}
              />
            ))}
          </Reveal>
        ) : (
          <div className="empty">
            <div className="empty-icon" aria-hidden>
              🔍
            </div>
            <p className="empty-title">Nenhum produto encontrado</p>
            <p>Tente ajustar os filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}
