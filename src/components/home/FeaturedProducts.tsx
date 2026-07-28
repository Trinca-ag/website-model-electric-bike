import Link from 'next/link'

import ProductCard from '@/components/product/ProductCard'
import { IconArrowRight } from '@/components/ui/Icons'
import Reveal from '@/components/ui/Reveal'
import { FEATURED_PRODUCTS } from '@/data/products'
import { UNITS } from '@/data/site'

export default function FeaturedProducts() {
  return (
    <section className="sec sec-tight" id="destaques">
      <p className="sec-lbl">Mais Vendidos</p>
      <h2 className="sec-ttl">NOSSOS DESTAQUES</h2>
      <p className="sec-sub">
        Conheça os modelos mais procurados em nossas {UNITS.length} unidades
      </p>

      <Reveal className="pgrid stg sec-grid">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} showLine={false} />
        ))}
      </Reveal>

      <div className="more-cta">
        <Link href="/produtos" className="btn-o">
          Ver Todos os Produtos
          <IconArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
