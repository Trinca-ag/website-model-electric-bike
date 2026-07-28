import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import ProductGallery from '@/components/product/ProductGallery'
import ProductJsonLd from '@/components/product/ProductJsonLd'
import ProductPerks from '@/components/product/ProductPerks'
import ProductPriceBlock from '@/components/product/ProductPriceBlock'
import ProductSpecs from '@/components/product/ProductSpecs'
import RelatedProducts from '@/components/product/RelatedProducts'
import { IconClock, IconWhatsapp } from '@/components/ui/Icons'
import { CATEGORIES, ID_TO_SLUG, PRODUCTS, getProduct } from '@/data/products'
import { SITE } from '@/data/site'
import { productWaLink } from '@/lib/whatsapp'

import '../../product.css'

interface ProductPageProps {
  // Next.js 16: params chega como Promise.
  params: Promise<{ slug: string }>
}

// Fora da lista de slugs não existe página — 404 de verdade, sem render dinâmico.
export const dynamicParams = false

export function generateStaticParams() {
  // Além dos slugs canônicos, pré-renderizamos os ids antigos do catálogo.
  // O site anterior linkava `produto.html?id=ct20s`, e o redirect do
  // next.config traduz isso para `/produto/ct20s` — que NÃO é o slug
  // (`ct20-s`). Sem estas entradas, 15 dos 31 produtos cairiam em 404 vindos
  // de links e resultados de busca antigos. Elas respondem com 308 para o slug.
  return [
    ...PRODUCTS.map((product) => ({ slug: product.slug })),
    ...Object.keys(ID_TO_SLUG).map((id) => ({ slug: id })),
  ]
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    return { title: 'Produto não encontrado' }
  }

  const canonical = `/produto/${product.slug}`

  return {
    title: product.name,
    description: product.desc,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      url: canonical,
      title: `${product.name} – ${SITE.name}`,
      description: product.desc,
      images: [
        {
          url: product.image,
          width: 1024,
          height: 1024,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} – ${SITE.name}`,
      description: product.desc,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  // Id legado (ct20s) → slug canônico (ct20-s), com 308. Nenhum id colide com
  // o slug de outro produto, então não há risco de laço de redirecionamento.
  const canonicalSlug = ID_TO_SLUG[slug]
  if (canonicalSlug) permanentRedirect(`/produto/${canonicalSlug}`)

  const product = getProduct(slug)

  if (!product) notFound()

  const category = CATEGORIES[product.cat]

  return (
    <>
      <ProductJsonLd product={product} />

      <nav className="breadcrumb pd-crumbs" aria-label="Trilha de navegação">
        <Link href="/">Início</Link>
        <span className="sep" aria-hidden="true">
          /
        </span>
        <Link href="/produtos">Produtos</Link>
        <span className="sep" aria-hidden="true">
          /
        </span>
        <Link href={`/produtos/${product.cat}`}>{category.label}</Link>
        <span className="sep" aria-hidden="true">
          /
        </span>
        <span className="cur" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="pd-layout">
        <ProductGallery product={product} />

        <div className="pd-info">
          <p className="pd-cat">
            {category.label} · {product.line}
          </p>
          <h1 className="pd-name">{product.name}</h1>
          {product.tag ? (
            <p className="pd-tag">
              <span aria-hidden="true">★</span> {product.tag}
            </p>
          ) : null}
          <p className="pd-desc">{product.desc}</p>

          <ProductPriceBlock product={product} />

          <div className="pd-actions">
            <a
              className="pd-btn-buy"
              href={productWaLink(product)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsapp size={20} />
              Falar no WhatsApp
            </a>
            <Link className="pd-btn-test" href="/#test-ride">
              <IconClock size={14} />
              Agendar Test Ride Gratuito
            </Link>
          </div>

          <ProductPerks />
        </div>
      </div>

      <section className="pd-sec" aria-labelledby="ficha-tecnica">
        <p className="sec-lbl">Ficha Técnica</p>
        <h2 className="sec-ttl pd-sec-ttl" id="ficha-tecnica">
          ESPECIFICAÇÕES
        </h2>
        <ProductSpecs specs={product.specs} />
      </section>

      <RelatedProducts product={product} />
    </>
  )
}
