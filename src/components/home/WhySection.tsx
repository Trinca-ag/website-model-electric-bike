import type { ComponentType, SVGProps } from 'react'

import CountUp from '@/components/ui/CountUp'
import {
  IconBolt,
  IconLeaf,
  IconMapPin,
  IconNoLicense,
  IconSun,
  IconWrench,
} from '@/components/ui/Icons'
import Reveal from '@/components/ui/Reveal'
import { SITE } from '@/data/site'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface WhyItem {
  readonly icon: IconComponent
  /** Número animado; quando ausente, `text` é exibido no lugar. */
  readonly value?: number
  readonly text?: string
  readonly unit?: string
  readonly title: string
  readonly desc: string
}

const ITEMS: readonly WhyItem[] = [
  {
    icon: IconBolt,
    value: 90,
    unit: '% de economia vs. carro',
    title: 'Economia Real',
    desc: 'Gaste até 90% menos em mobilidade. A diferença no bolso é enorme comparado a veículos a combustão.',
  },
  {
    icon: IconNoLicense,
    text: 'SEM CNH',
    title: 'Sem Habilitação',
    desc: 'A maioria dos modelos não exige habilitação. Liberdade para todas as idades a partir de 14 anos.',
  },
  {
    icon: IconLeaf,
    value: 0,
    unit: 'g CO₂ por quilômetro',
    title: 'Zero Emissões',
    desc: 'Mobilidade limpa e sustentável. Contribua com o meio ambiente sem abrir mão da performance.',
  },
  {
    icon: IconMapPin,
    value: 4,
    unit: 'unidades físicas',
    title: 'Lojas Físicas',
    desc: 'Compre, teste e experimente presencialmente. 4 unidades em SP para agendar seu test ride gratuito.',
  },
  {
    icon: IconWrench,
    value: 12,
    unit: 'meses de garantia',
    title: 'Garantia Total',
    desc: 'Assistência técnica especializada, peças originais e suporte completo após a compra.',
  },
  {
    icon: IconSun,
    value: 150,
    unit: 'km de autonomia máxima',
    title: 'Alta Autonomia',
    desc: 'Modelos com até 150km de autonomia real. Carregue em casa, no trabalho ou em pontos de recarga.',
  },
]

export default function WhySection() {
  return (
    <section className="sec why-sec">
      <div className="why-inner">
        <p className="sec-lbl">Diferenciais</p>
        <h2 className="sec-ttl">
          POR QUE <span className="g">{SITE.name}?</span>
        </h2>

        <Reveal className="why-grid stg">
          {ITEMS.map(({ icon: Icon, value, text, unit, title, desc }) => (
            <div key={title} className="why-item rev">
              <div className="why-ico">
                <Icon size={22} />
              </div>

              {typeof value === 'number' ? (
                <>
                  <p className="why-num">
                    <CountUp value={value} />
                  </p>
                  <p className="why-unit">{unit}</p>
                </>
              ) : (
                <>
                  <p className="why-num is-text">{text}</p>
                  {/* Espaçador: mantém o alinhamento dos títulos na grade. */}
                  <p className="why-unit is-empty" aria-hidden>
                    &nbsp;
                  </p>
                </>
              )}

              <h3 className="why-title">{title}</h3>
              <p className="why-desc">{desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
