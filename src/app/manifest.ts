import type { MetadataRoute } from 'next'

import { SITE } from '@/data/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} – ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['shopping', 'lifestyle', 'travel'],
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
