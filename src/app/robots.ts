import type { MetadataRoute } from 'next'

import { SITE } from '@/data/site'

// Necessário para `output: 'export'` — sem params dinâmicos, é gerado uma vez no build de qualquer forma.
export const dynamic = 'force-static'

const BASE = SITE.url.replace(/\/+$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
