import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF primeiro: ~20-30% menor que WebP nas fotos do catálogo.
    formats: ['image/avif', 'image/webp'],
    // Larguras alinhadas aos breakpoints reais do layout (evita gerar variantes inúteis).
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 200, 256, 320, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },


  async headers() {
    return [
      {
        // Os arquivos em /media NÃO têm hash de conteúdo no nome (ct20.webp).
        // Com `immutable`, trocar a foto de um produto deixaria o navegador
        // servindo a antiga por até um ano. `stale-while-revalidate` entrega
        // rápido do cache e atualiza em segundo plano.
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // URLs legadas do site estático anterior.
      { source: '/index.html', destination: '/', permanent: true },
      {
        source: '/produtos.html',
        has: [{ type: 'query', key: 'cat', value: '(?<cat>.*)' }],
        destination: '/produtos/:cat',
        permanent: true,
      },
      { source: '/produtos.html', destination: '/produtos', permanent: true },
      {
        source: '/produto.html',
        has: [{ type: 'query', key: 'id', value: '(?<id>.*)' }],
        destination: '/produto/:id',
        permanent: true,
      },
      { source: '/produto.html', destination: '/produtos', permanent: true },
    ]
  },
}

export default nextConfig
