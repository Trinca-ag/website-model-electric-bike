import Link from 'next/link'

import HeroCarousel from '@/components/home/HeroCarousel'
import { IconArrowRight, IconMapPin } from '@/components/ui/Icons'

/**
 * Hero da home. O texto (inclusive o <h1>, que é o LCP textual) é renderizado
 * no servidor e entregue ao carrossel via children.
 */
export default function Hero() {
  return (
    <HeroCarousel>
      <h1 className="htitle">
        Mobilidade <span className="g">Elétrica</span> de
        <br />
        Alta Performance
      </h1>
      <p className="hsub">
        Bikes, Patinetes e Pranchas elétricas
        <br />
        que redefinem o jeito de se mover na cidade.
      </p>
      <div className="hctas">
        <Link href="/produtos" className="btn-p">
          <IconArrowRight size={15} />
          Explorar Todos os Modelos
        </Link>
        <Link href="/#unidades" className="btn-o">
          <IconMapPin size={15} />
          Encontrar a Loja Mais Próxima
        </Link>
      </div>
    </HeroCarousel>
  )
}
