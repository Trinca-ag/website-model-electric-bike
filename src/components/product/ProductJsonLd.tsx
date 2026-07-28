import { CATEGORIES } from '@/data/products'
import { SITE } from '@/data/site'
import type { Product } from '@/types/product'

/**
 * Escapa `<` para que nenhum valor consiga fechar a tag <script>.
 * Os dados vêm do nosso próprio catálogo (não há entrada de usuário aqui),
 * mas o custo de blindar é zero.
 */
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

interface ProductJsonLdProps {
  product: Product
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const category = CATEGORIES[product.cat]
  const url = `${SITE.url}/produto/${product.slug}`

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [`${SITE.url}${product.image}`],
    description: product.desc,
    sku: product.id,
    mpn: product.id,
    category: category.label,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: product.pricePix,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE.name },
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: 'Início', item: `${SITE.url}/` },
      { name: 'Produtos', item: `${SITE.url}/produtos` },
      { name: category.label, item: `${SITE.url}/produtos/${product.cat}` },
      { name: product.name, item: url },
    ].map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbLd) }}
      />
    </>
  )
}
