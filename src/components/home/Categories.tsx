import Image from 'next/image'
import Link from 'next/link'

import Reveal from '@/components/ui/Reveal'
import { COUNT_BY_CATEGORY } from '@/data/products'
import type { CategoryId } from '@/types/product'

interface CategoryCard {
  readonly id: CategoryId
  readonly image: string
  readonly alt: string
  /** Título quebrado em duas linhas, como no layout original. */
  readonly title: readonly [string, string]
}

const CARDS: readonly CategoryCard[] = [
  {
    id: 'bikes',
    image: '/media/categorias/cat-bike.webp',
    alt: 'Bike elétrica',
    title: ['Bikes', 'Elétricas'],
  },
  {
    id: 'patinetes',
    image: '/media/categorias/cat-patinete.webp',
    alt: 'Patinete elétrico',
    title: ['Patinetes', 'Elétricos'],
  },
  {
    id: 'pranchas',
    image: '/media/categorias/cat-prancha.webp',
    alt: 'Prancha elétrica',
    title: ['Pranchas', 'Elétricas'],
  },
]

// Grade de 3 colunas, 2 abaixo de 900px e 1 abaixo de 600px.
const SIZES = '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw'

export default function Categories() {
  return (
    <section className="sec">
      <p className="sec-lbl">O que oferecemos</p>
      <h2 className="sec-ttl">NOSSAS CATEGORIAS</h2>

      <Reveal className="catgrid stg">
        {CARDS.map((card) => {
          const count = COUNT_BY_CATEGORY[card.id]

          return (
            <Link
              key={card.id}
              href={`/produtos/${card.id}`}
              className="catcard rev"
            >
              <Image src={card.image} alt={card.alt} fill sizes={SIZES} />
              <span className="catov" />
              <div className="catcnt">
                <p className="cat-n">
                  {count} {count === 1 ? 'modelo' : 'modelos'}
                </p>
                <h3 className="cat-t">
                  {card.title[0]}
                  <br />
                  {card.title[1]}
                </h3>
                <span className="cat-cta">Ver Todos →</span>
              </div>
            </Link>
          )
        })}
      </Reveal>
    </section>
  )
}
