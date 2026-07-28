// Intl.NumberFormat é caro para instanciar — criamos uma vez só por formato.
const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const BRL_FULL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * R$ 15.299 / R$ 15.299,10 — usado em cards e listagens.
 *
 * Valor redondo sai sem centavos; com centavos sai com DUAS casas. O original
 * usava `maximumFractionDigits: 2` sozinho e imprimia "R$ 17.999,1".
 */
export function brl(value: number): string {
  return Number.isInteger(value) ? BRL_COMPACT.format(value) : BRL_FULL.format(value)
}

/** R$ 15.299,10 — usado no bloco de preço da página de produto. */
export function brlFull(value: number): string {
  return BRL_FULL.format(value)
}
