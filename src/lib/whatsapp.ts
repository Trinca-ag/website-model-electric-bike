import { SITE } from '@/data/site'
import { brlFull } from '@/lib/format'
import type { Product } from '@/types/product'

export function waLink(message: string, phone: string = SITE.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/** Mensagem pré-preenchida com o produto de interesse. */
export function productWaLink(product: Product): string {
  const priceText = product.onRequest
    ? ''
    : ` (a partir de ${brlFull(product.pricePix)} no PIX)`

  return waLink(
    `Olá! Tenho interesse no *${product.name}*${priceText}. ` +
      'Pode me passar mais informações sobre disponibilidade, condições de pagamento e entrega?',
  )
}
