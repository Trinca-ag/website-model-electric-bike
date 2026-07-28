import type { Metadata } from 'next'
import Link from 'next/link'

import { IconArrowRight } from '@/components/ui/Icons'

import './product.css'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="pd-404">
      <p className="pd-404-num">404</p>
      <h1 className="sec-ttl">PÁGINA NÃO ENCONTRADA</h1>
      <p className="pd-404-txt">
        O link que você abriu não existe mais ou o produto saiu de linha. Dá uma
        olhada no catálogo completo — provavelmente tem algo ainda melhor por lá.
      </p>
      <Link className="btn-p" href="/produtos">
        Ver Catálogo Completo
        <IconArrowRight size={16} />
      </Link>
    </section>
  )
}
