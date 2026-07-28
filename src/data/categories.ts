import type { Category, CategoryId } from '@/types/product'

/**
 * Metadados de categoria, separados de `products.ts` de propósito.
 *
 * Componentes de cliente (formulário de test ride, catálogo, card de produto)
 * precisam só destes rótulos. Se os importassem de `products.ts`, o bundler
 * arrastaria o array `PRODUCTS` inteiro — 31 produtos com descrições e fichas
 * técnicas, ~19 KB minificados — para o JavaScript do navegador, além de
 * executar os índices (Maps, Sets, filtros) na hidratação sem nenhum uso.
 */
export const CATEGORIES: Readonly<Record<CategoryId, Category>> = {
  bikes: {
    id: 'bikes',
    label: 'Bikes Elétricas',
    short: 'Bikes',
    singular: 'Bike Elétrica',
    heroImage: '/media/categorias/bg-bike.webp',
    heroAlt: 'Piloto acelerando uma bike elétrica dentro de um túnel iluminado',
  },
  patinetes: {
    id: 'patinetes',
    label: 'Patinetes Elétricos',
    short: 'Patinetes',
    singular: 'Patinete Elétrico',
    heroImage: '/media/categorias/bg-patinete.webp',
    heroAlt: 'Homem de terno em um patinete elétrico numa estrada com a cidade ao fundo',
  },
  pranchas: {
    id: 'pranchas',
    label: 'Pranchas / Jetboards',
    short: 'Pranchas',
    singular: 'Prancha Elétrica',
    heroImage: '/media/categorias/bg-prancha.webp',
    heroAlt: 'Mergulhador conduzindo uma prancha elétrica sobre um recife de corais',
  },
}

export const CATEGORY_IDS = ['bikes', 'patinetes', 'pranchas'] as const

export function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(value)
}
