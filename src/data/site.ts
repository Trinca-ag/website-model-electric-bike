/**
 * Identidade do site — ÚNICO lugar a editar ao clonar este modelo para uma
 * nova marca. Nome, domínio e WhatsApp se propagam para títulos, metadados,
 * JSON-LD, sitemap, imagem de compartilhamento e mensagens do WhatsApp.
 */
export const SITE = {
  name: 'WEB SITE MODEL',
  tagline: 'Mobilidade Elétrica de Alta Performance',
  description:
    'Bikes, patinetes e pranchas elétricas de alta performance. 4 unidades em SP para test ride gratuito, assistência técnica e financiamento.',
  /** Trocar pelo domínio real antes do deploy (usado em canonical, OG e sitemap). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exemplo.com.br',
  locale: 'pt_BR',
  whatsapp: '5511999999999',
} as const

export interface Unit {
  readonly id: string
  readonly name: string
  readonly street: string
  readonly city: string
  /** Uma entrada por linha exibida — permite separar sábado, domingo, feriado. */
  readonly hours: readonly string[]
  readonly tags: readonly string[]
  readonly whatsapp: string
  readonly mapsQuery: string
  readonly image: string
}

export const UNITS: readonly Unit[] = [
  {
    id: 'paulista',
    name: 'Unidade Paulista',
    street: 'Av. Paulista, 1578, Bela Vista',
    city: 'São Paulo – SP, 01310-200',
    hours: ['Seg–Sex 09h–19h', 'Sáb 09h–17h'],
    tags: ['Test Ride', 'Assistência', 'Financiamento'],
    whatsapp: '5511999999991',
    mapsQuery: 'Av. Paulista, 1578, Bela Vista, São Paulo - SP, 01310-200',
    image: '/media/unidades/unidade-1.webp',
  },
  {
    id: 'pinheiros',
    name: 'Unidade Pinheiros',
    street: 'R. dos Pinheiros, 498, Pinheiros',
    city: 'São Paulo – SP, 05422-000',
    hours: ['Seg–Sex 09h–19h', 'Sáb 09h–17h'],
    tags: ['Test Ride', 'Manutenção'],
    whatsapp: '5511999999992',
    mapsQuery: 'R. dos Pinheiros, 498, Pinheiros, São Paulo - SP, 05422-000',
    image: '/media/unidades/unidade-2.webp',
  },
  {
    id: 'santo-andre',
    name: 'Unidade Santo André',
    street: 'Av. Portugal, 300, Centro',
    city: 'Santo André – SP, 09040-000',
    hours: ['Seg–Sex 09h–18h', 'Sáb 09h–15h'],
    tags: ['Test Ride', 'Assistência'],
    whatsapp: '5511999999993',
    mapsQuery: 'Av. Portugal, 300, Centro, Santo André - SP, 09040-000',
    image: '/media/unidades/unidade-3.webp',
  },
  {
    id: 'campinas',
    name: 'Unidade Campinas',
    street: 'R. Coronel Quirino, 1472, Cambuí',
    city: 'Campinas – SP, 13025-000',
    hours: ['Seg–Sex 09h–18h', 'Sáb 09h–14h'],
    tags: ['Test Ride', 'Financiamento'],
    whatsapp: '5511999999994',
    mapsQuery: 'R. Coronel Quirino, 1472, Cambuí, Campinas - SP, 13025-000',
    image: '/media/unidades/unidade-4.webp',
  },
]

export interface NavLink {
  readonly href: string
  readonly label: string
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/produtos/bikes', label: 'Bikes' },
  { href: '/produtos/patinetes', label: 'Patinetes' },
  { href: '/produtos/pranchas', label: 'Pranchas' },
  { href: '/#unidades', label: 'Unidades' },
  { href: '/#test-ride', label: 'Contato' },
]

/** Foto de fundo do cabeçalho de /produtos (o catálogo com todas as categorias). */
export const CATALOG_HERO = {
  src: '/media/categorias/bg-todos.webp',
  alt: 'Um patinete elétrico e uma bike elétrica lado a lado numa avenida, com a cidade ao fundo',
  // Os pilotos e o skyline estão na metade de cima; centralizar decapitava os dois.
  position: 'center top',
} as const

export interface HeroSlide {
  readonly src: string
  readonly poster: string
}

export const HERO_SLIDES: readonly HeroSlide[] = [
  { src: '/media/video/banner-1.mp4', poster: '/media/video/poster-1.jpg' },
  { src: '/media/video/banner-2.mp4', poster: '/media/video/poster-2.jpg' },
  { src: '/media/video/banner-3.mp4', poster: '/media/video/poster-3.jpg' },
]

export const FOOTER_SECTIONS = [
  {
    title: 'Produtos',
    links: [
      { href: '/produtos/bikes', label: 'Bikes Elétricas' },
      { href: '/produtos/patinetes', label: 'Patinetes Elétricos' },
      { href: '/produtos/pranchas', label: 'Pranchas Elétricas' },
      { href: '/produtos', label: 'Catálogo Completo' },
    ],
  },
  {
    title: 'A Empresa',
    links: [
      { href: '/#unidades', label: 'Nossas Unidades' },
      { href: '/#test-ride', label: 'Agendar Test Ride' },
      { href: '/produtos', label: 'Todos os Modelos' },
    ],
  },
] as const
