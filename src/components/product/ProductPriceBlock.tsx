import { brl, brlFull } from '@/lib/format'
import type { Product } from '@/types/product'

interface ProductPriceBlockProps {
  product: Product
}

export default function ProductPriceBlock({ product }: ProductPriceBlockProps) {
  // Produtos sob consulta não exibem valor nenhum — nem parcelamento, nem pill do PIX.
  if (product.onRequest) {
    return (
      <div className="pd-price-block">
        <p className="pd-price-lbl">Sob consulta</p>
        <div className="pd-price-row">
          <p className="pd-price">Consulte</p>
        </div>
        <p className="pd-installment">
          Entre em contato pelo WhatsApp para condições especiais.
        </p>
      </div>
    )
  }

  const savings = product.price - product.pricePix

  return (
    <div className="pd-price-block">
      <p className="pd-price-lbl">Preço no PIX</p>
      <div className="pd-price-row">
        <p className="pd-price">{brlFull(product.pricePix)}</p>
        <p className="pd-price-old">
          <span className="sr-only">Preço sem desconto: </span>
          {brl(product.price)}
        </p>
      </div>
      <p className="pd-installment">
        ou <strong>12× de {brlFull(product.installment)}</strong> sem juros no
        cartão
      </p>
      <p className="pd-pix">10% off no PIX · economize {brlFull(savings)}</p>
    </div>
  )
}
