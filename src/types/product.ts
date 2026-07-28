export type CategoryId = 'bikes' | 'patinetes' | 'pranchas'

export type RangeUnit = 'km' | 'min'

export interface Category {
  readonly id: CategoryId
  /** Nome completo, usado em títulos e breadcrumbs. */
  readonly label: string
  /** Nome curto, usado em pills e navegação. */
  readonly short: string
  /** Rótulo no singular, usado no card do produto. */
  readonly singular: string
  /** Imagem de fundo do cabeçalho da rota /produtos/<categoria>. */
  readonly heroImage: string
  /** Descrição da imagem de fundo, para leitores de tela. */
  readonly heroAlt: string
}

export interface Product {
  readonly id: string
  readonly slug: string
  readonly cat: CategoryId
  readonly line: string
  readonly name: string
  /** Caminho público da imagem otimizada (WebP). */
  readonly image: string
  readonly price: number
  readonly pricePix: number
  readonly installment: number
  /** Velocidade máxima em km/h. */
  readonly speed: number
  /** Autonomia — a unidade depende de `rangeUnit`. */
  readonly range: number
  readonly rangeUnit: RangeUnit
  readonly power: string
  readonly tag: string | null
  readonly desc: string
  readonly specs: Readonly<Record<string, string>>
  /** Produtos sem preço público (venda sob consulta). */
  readonly onRequest?: boolean
}
