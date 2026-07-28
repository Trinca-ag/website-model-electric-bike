import Link from 'next/link'

import { IconBike, IconScooter, IconWaves } from '@/components/ui/Icons'
import { CATEGORIES, CATEGORY_IDS } from '@/data/products'
import type { CategoryId } from '@/types/product'

const ICONS: Record<CategoryId, typeof IconBike> = {
  bikes: IconBike,
  patinetes: IconScooter,
  pranchas: IconWaves,
}

interface CategoryPillsProps {
  /** `null` = rota /produtos (todas as categorias). */
  active: CategoryId | null
}

/**
 * Filtro de categoria — no site original eram botões que trocavam estado;
 * aqui cada pill é uma rota estática própria, com prefetch do next/link.
 */
export default function CategoryPills({ active }: CategoryPillsProps) {
  return (
    <div className="cat-pills">
      <Link
        href="/produtos"
        className={`cpill${active === null ? ' on' : ''}`}
        aria-current={active === null ? 'page' : undefined}
      >
        Todos
      </Link>

      {CATEGORY_IDS.map((id) => {
        const Icon = ICONS[id]
        const on = active === id
        return (
          <Link
            key={id}
            href={`/produtos/${id}`}
            className={`cpill${on ? ' on' : ''}`}
            aria-current={on ? 'page' : undefined}
          >
            <Icon size={12} />
            {CATEGORIES[id].short}
          </Link>
        )
      })}
    </div>
  )
}
