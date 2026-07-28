import type { Metadata } from 'next'

import CatalogHero from '@/components/catalog/CatalogHero'
import CatalogView from '@/components/catalog/CatalogView'
import CategoryPills from '@/components/catalog/CategoryPills'
import { PRODUCTS } from '@/data/products'
import { CATALOG_HERO, SITE } from '@/data/site'

import '../catalog.css'

const DESCRIPTION = `Catálogo completo ${SITE.name}: ${PRODUCTS.length} modelos de bikes, patinetes e pranchas elétricas. Filtre por linha, preço, velocidade e autonomia.`

export const metadata: Metadata = {
  title: 'Catálogo Completo',
  description: DESCRIPTION,
  alternates: { canonical: '/produtos' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: `${SITE.url}/produtos`,
    siteName: SITE.name,
    title: `Catálogo Completo – ${SITE.name}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Catálogo Completo – ${SITE.name}`,
    description: DESCRIPTION,
  },
}

export default function ProdutosPage() {
  return (
    <>
      <CatalogHero
        titleTop="CATÁLOGO"
        titleBottom="COMPLETO"
        subtitle="Bikes, Patinetes e Pranchas elétricas — toda a linha, do urbano ao alto desempenho."
        background={CATALOG_HERO}
      />
      <CatalogView products={PRODUCTS} pills={<CategoryPills active={null} />} />
    </>
  )
}
