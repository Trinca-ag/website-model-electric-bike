import type { MetadataRoute } from 'next'

import { CATEGORY_IDS, PRODUCTS } from '@/data/products'
import { SITE } from '@/data/site'

/** NEXT_PUBLIC_SITE_URL pode vir com barra final; o sitemap não pode gerar `//`. */
const BASE = SITE.url.replace(/\/+$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  // Uma única data por build: todas as URLs mudam juntas quando o site é publicado.
  const lastModified = new Date()

  const home: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/produtos`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const categories: MetadataRoute.Sitemap = CATEGORY_IDS.map((cat) => ({
    url: `${BASE}/produtos/${cat}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const products: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/produto/${p.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...home, ...categories, ...products]
}
