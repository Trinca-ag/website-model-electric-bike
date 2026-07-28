import type { ComponentType, SVGProps } from 'react'

import TestRideForm from '@/components/home/TestRideForm'
import {
  IconCheckCircle,
  IconStopwatch,
  IconTag,
} from '@/components/ui/Icons'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface Benefit {
  readonly icon: IconComponent
  readonly title: string
  readonly sub: string
}

const BENEFITS: readonly Benefit[] = [
  {
    icon: IconCheckCircle,
    title: '100% Gratuito',
    sub: 'Sem compromisso de compra',
  },
  {
    icon: IconStopwatch,
    title: '30 minutos de experiência',
    sub: 'Percurso guiado com especialista',
  },
  {
    icon: IconTag,
    title: 'Desconto exclusivo',
    sub: '10% off na compra após o test ride',
  },
]

/**
 * Seção do test ride. Só o formulário é componente de cliente — o texto e os
 * cards de benefício são estáticos e ficam no servidor.
 */
export default function TestRide() {
  return (
    <section className="sec form-sec" id="test-ride">
      <div className="fgrid">
        <div>
          <p className="sec-lbl">Gratuito</p>
          <h2 className="sec-ttl">
            AGENDE SEU
            <br />
            <span className="g">TEST RIDE</span>
          </h2>
          <p className="sec-sub fsub">
            Experimente antes de comprar. Sinta a diferença de andar com um
            veículo elétrico de alta performance.
          </p>

          <div className="bcards">
            {BENEFITS.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="bcard">
                <div className="bico">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="btitle">{title}</h3>
                  <p className="bsub">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TestRideForm />
      </div>
    </section>
  )
}
