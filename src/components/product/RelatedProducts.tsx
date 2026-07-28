import ProductCard from '@/components/product/ProductCard'
import Reveal from '@/components/ui/Reveal'
import { getProductsByCategory } from '@/data/products'
import type { Product } from '@/types/product'

const MAX_RELATED = 4

/**
 * Os próximos produtos da mesma categoria, em ordem circular a partir do atual.
 *
 * O site estático embaralhava com `.sort(() => Math.random() - 0.5)` — além de
 * ser um shuffle enviesado, daria um HTML diferente a cada build e quebraria a
 * geração estática. Circular é determinístico e ainda garante que cada produto
 * da categoria apareça como "relacionado" de alguém.
 */
function pickRelated(product: Product): Product[] {
  const siblings = getProductsByCategory(product.cat)
  const current = siblings.findIndex((p) => p.id === product.id)
  const start = current < 0 ? 0 : current

  const related: Product[] = []
  for (let i = 1; i < siblings.length && related.length < MAX_RELATED; i++) {
    const candidate = siblings[(start + i) % siblings.length]
    if (candidate && candidate.id !== product.id) related.push(candidate)
  }
  return related
}

interface RelatedProductsProps {
  product: Product
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const related = pickRelated(product)
  if (related.length === 0) return null

  return (
    <section className="pd-sec" aria-labelledby="relacionados">
      <p className="sec-lbl">Veja Também</p>
      <h2 className="sec-ttl pd-sec-ttl" id="relacionados">
        PRODUTOS RELACIONADOS
      </h2>
      <Reveal className="pgrid stg pd-rel-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </Reveal>
    </section>
  )
}
