import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import CatalogHero from '@/components/catalog/CatalogHero'
import CatalogView from '@/components/catalog/CatalogView'
import CategoryPills from '@/components/catalog/CategoryPills'
import {
  CATEGORIES,
  CATEGORY_IDS,
  COUNT_BY_CATEGORY,
  getProductsByCategory,
  isCategoryId,
} from '@/data/products'
import { SITE } from '@/data/site'
import type { CategoryId } from '@/types/product'

import '../../catalog.css'

interface CategoryCopy {
  /** As duas linhas do H1 — a segunda sai em neon. */
  readonly titleTop: string
  readonly titleBottom: string
  readonly subtitle: string
  readonly description: string
}

const COPY: Record<CategoryId, CategoryCopy> = {
  bikes: {
    titleTop: 'BIKES',
    titleBottom: 'ELÉTRICAS',
    subtitle:
      'Fat bikes, urbanas e alta performance — do padrão europeu de 25 km/h aos 85 km/h da R300.',
    description: `${COUNT_BY_CATEGORY.bikes} modelos de bikes elétricas, de 500 W a 3000 W e até 120 km de autonomia. Filtre por linha, preço, velocidade e autonomia.`,
  },
  patinetes: {
    titleTop: 'PATINETES',
    titleBottom: 'ELÉTRICOS',
    subtitle:
      'Patinetes dobráveis para o dia a dia — do compacto de 350 W ao dual motor que chega a 67 km/h.',
    description: `${COUNT_BY_CATEGORY.patinetes} patinetes elétricos dobráveis, de 350 W ao dual motor de 2x900 W e até 67 km/h. Filtre por linha, preço, velocidade e autonomia.`,
  },
  pranchas: {
    titleTop: 'PRANCHAS',
    titleBottom: 'JETBOARDS',
    subtitle:
      'Jetboards elétricos de 8000 W a 12000 W — até 60 km/h sobre a água, em EPP ou fibra de carbono.',
    description: `Jetboards elétricos: até 12000 W de potência, 60 km/h sobre a água e cascos em EPP ou fibra de carbono. ${COUNT_BY_CATEGORY.pranchas} modelos disponíveis.`,
  },
}

interface CategoryPageProps {
  params: Promise<{ categoria: string }>
}

/** As três categorias viram HTML estático no build. */
export function generateStaticParams() {
  return CATEGORY_IDS.map((categoria) => ({ categoria }))
}

/** Qualquer outro slug é 404 — não existe categoria sob demanda. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params
  if (!isCategoryId(categoria)) return {}

  const category = CATEGORIES[categoria]
  const copy = COPY[categoria]
  const path = `/produtos/${categoria}`

  return {
    title: category.label,
    description: copy.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      title: `${category.label} – ${SITE.name}`,
      description: copy.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.label} – ${SITE.name}`,
      description: copy.description,
    },
  }
}

export default async function CategoriaPage({ params }: CategoryPageProps) {
  const { categoria } = await params
  if (!isCategoryId(categoria)) notFound()

  const category = CATEGORIES[categoria]
  const copy = COPY[categoria]

  return (
    <>
      <CatalogHero
        titleTop={copy.titleTop}
        titleBottom={copy.titleBottom}
        subtitle={copy.subtitle}
        category={category}
        background={{ src: category.heroImage, alt: category.heroAlt }}
      />
      <CatalogView
        products={getProductsByCategory(categoria)}
        pills={<CategoryPills active={categoria} />}
      />
    </>
  )
}
