import Image from 'next/image'
import Link from 'next/link'

import { CATEGORIES } from '@/data/categories'
import { brl } from '@/lib/format'
import { productWaLink } from '@/lib/whatsapp'
import { IconWhatsapp } from '@/components/ui/Icons'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  /** Layout horizontal usado na visualização em lista do catálogo. */
  list?: boolean
  /** Marca a imagem como LCP candidate — use apenas nos primeiros cards. */
  priority?: boolean
  /** `Categoria · Linha` no catálogo, só o nome da categoria na home. */
  showLine?: boolean
}

// Grade de 3 colunas em desktop, 2 em tablet, 1 em mobile — o `sizes` precisa
// bater com isso para o next/image não baixar uma variante grande demais.
const GRID_SIZES = '(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw'
const LIST_SIZES = '(max-width: 600px) 100vw, 280px'

/**
 * Card de produto — Server Component puro (0 KB de JS no cliente).
 *
 * O card inteiro é clicável via "stretched link": o link do nome se expande
 * sobre o card com um ::after absoluto. Isso mantém o HTML válido (nada de
 * âncora dentro de âncora) e deixa o botão do WhatsApp funcionar como um
 * segundo destino, sem precisar de handler de clique.
 */
export default function ProductCard({
  product,
  list = false,
  priority = false,
  showLine = true,
}: ProductCardProps) {
  const category = CATEGORIES[product.cat]
  const label = showLine
    ? `${category.label} · ${product.line}`
    : category.singular

  return (
    <article className={`pcard rev${list ? ' list-card' : ''}`}>
      <div className="pimg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={list ? LIST_SIZES : GRID_SIZES}
          priority={priority}
        />
        {product.tag ? <span className="ptag">{product.tag}</span> : null}
        <span className="p360">Ver detalhes →</span>
      </div>

      <div className="pbody">
        <div>
          <div className="pcat">{label}</div>
          <h3 className="pname">
            <Link href={`/produto/${product.slug}`} className="pname-link">
              {product.name}
            </Link>
          </h3>
          <p className="pdesc">{product.desc}</p>
          <div className="pspecs">
            <div className="pspec">
              Autonomia
              <span>
                {product.range} {product.rangeUnit}
              </span>
            </div>
            <div className="pspec">
              Velocidade<span>{product.speed} km/h</span>
            </div>
            <div className="pspec">
              Potência<span>{product.power}</span>
            </div>
          </div>
        </div>

        <div className="pfooter">
          <div className="pprice">
            <small>
              {product.onRequest ? 'Sob consulta' : 'PIX a partir de'}
            </small>
            {product.onRequest ? 'WhatsApp' : brl(product.pricePix)}
          </div>
          <a
            href={productWaLink(product)}
            className="btn-c btn-wa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Falar no WhatsApp sobre ${product.name}`}
          >
            <IconWhatsapp size={12} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
