import Image from 'next/image'

import type { Product } from '@/types/product'

/**
 * A galeria ocupa ~52% de um container de 1500px no desktop e a largura
 * inteira (menos o padding lateral) a partir de 1000px.
 */
const GALLERY_SIZES =
  '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) calc(100vw - 48px), (max-width: 1500px) 52vw, 700px'

/** '2x 1000W' → '2×1000'; '1000W' → '1000'. O "Watts" vira rótulo do bloco. */
function watts(power: string): string {
  return power.replace('W', '').replace('x ', '×').trim()
}

interface ProductGalleryProps {
  product: Product
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div className="pd-gallery">
      <div className="pd-main-img">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={GALLERY_SIZES}
          priority
        />
        {product.tag ? <span className="pd-img-badge">{product.tag}</span> : null}
        <span className="pd-line-badge">{product.line}</span>
      </div>

      <ul className="pd-glance">
        <li className="pd-glass">
          <span className="pd-glass-v">{product.speed}</span>
          <span className="pd-glass-l">km/h máx</span>
        </li>
        <li className="pd-glass">
          <span className="pd-glass-v">{product.range}</span>
          <span className="pd-glass-l">{product.rangeUnit} autonomia</span>
        </li>
        <li className="pd-glass">
          <span className="pd-glass-v">{watts(product.power)}</span>
          <span className="pd-glass-l">Watts</span>
        </li>
      </ul>
    </div>
  )
}
