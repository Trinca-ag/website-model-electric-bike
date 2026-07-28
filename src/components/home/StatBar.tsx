import type { ComponentType, SVGProps } from 'react'

import {
  IconBolt,
  IconClock,
  IconCoins,
  IconShield,
} from '@/components/ui/Icons'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface Stat {
  readonly icon: IconComponent
  readonly label: string
}

const STATS: readonly Stat[] = [
  { icon: IconBolt, label: 'Sem necessidade de CNH' },
  { icon: IconClock, label: 'Até 150km de autonomia' },
  { icon: IconShield, label: '12 meses de garantia' },
  { icon: IconCoins, label: 'Economia de até 90%' },
]

export default function StatBar() {
  return (
    <ul className="stat-bar">
      {STATS.map(({ icon: Icon, label }) => (
        <li key={label} className="stat-item">
          <Icon size={16} strokeWidth={2.5} />
          {label}
        </li>
      ))}
    </ul>
  )
}
