import Image from 'next/image'

import { IconClock } from '@/components/ui/Icons'
import Reveal from '@/components/ui/Reveal'
import { UNITS } from '@/data/site'
import { waLink } from '@/lib/whatsapp'

// Duas colunas em desktop, uma coluna abaixo de 900px.
const SIZES = '(max-width: 900px) 100vw, 50vw'

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export default function Units() {
  return (
    <section className="sec" id="unidades">
      <p className="sec-lbl">Presença Física</p>
      <h2 className="sec-ttl">NOSSAS {UNITS.length} UNIDADES</h2>
      <p className="sec-sub">
        Visite a loja mais próxima. Faça um test ride gratuito e leve seu modelo
        para casa hoje.
      </p>

      <Reveal className="ugrid stg">
        {UNITS.map((unit) => (
          <article key={unit.id} className="ucard rev">
            <div className="uimg">
              <Image src={unit.image} alt={unit.name} fill sizes={SIZES} />
            </div>

            <div className="ubody">
              <div>
                <h3 className="uname">{unit.name}</h3>
                <p className="uaddr">
                  {unit.street}
                  <br />
                  {unit.city}
                </p>
                <p className="uhours">
                  <IconClock size={16} />
                  <span className="uhours-lines">
                    {unit.hours.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </p>
                <ul className="utags">
                  {unit.tags.map((tag) => (
                    <li key={tag} className="utag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="uacts">
                <a
                  href={mapsUrl(unit.mapsQuery)}
                  className="btn-sm btn-sm-g"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Como chegar à ${unit.name} no Google Maps`}
                >
                  Como Chegar
                </a>
                <a
                  href={waLink(
                    `Olá! Gostaria de falar com a ${unit.name}.`,
                    unit.whatsapp,
                  )}
                  className="btn-sm btn-sm-o"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Falar no WhatsApp com a ${unit.name}`}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}
