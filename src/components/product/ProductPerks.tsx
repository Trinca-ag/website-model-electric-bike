import {
  IconCreditCard,
  IconMapPin,
  IconShield,
  IconTruck,
} from '@/components/ui/Icons'
import { SITE, UNITS } from '@/data/site'

/** Condições de entrega, garantia, retirada e pagamento — iguais para todo o catálogo. */
export default function ProductPerks() {
  return (
    <ul className="pd-perks">
      <li className="pd-perk">
        <IconTruck size={16} />
        <span>
          Entrega em todo o Brasil · <strong>Frete grátis acima de R$ 5.000</strong>
        </span>
      </li>
      <li className="pd-perk">
        <IconShield size={16} />
        <span>
          Garantia de <strong>12 meses</strong> com assistência {SITE.name}
        </span>
      </li>
      <li className="pd-perk">
        <IconMapPin size={16} />
        <span>
          Retirada disponível nas <strong>{UNITS.length} unidades</strong>
        </span>
      </li>
      <li className="pd-perk">
        <IconCreditCard size={16} />
        <span>
          Até <strong>12× sem juros</strong> no cartão
        </span>
      </li>
    </ul>
  )
}
