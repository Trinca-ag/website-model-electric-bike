'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { IconArrowDown } from '@/components/ui/Icons'
import { HERO_SLIDES } from '@/data/site'

interface HeroCarouselProps {
  /** Conteúdo textual do hero — vem do servidor, não entra no bundle. */
  children: ReactNode
}

const TOTAL = HERO_SLIDES.length
const POSTER = HERO_SLIDES[0]?.poster

/**
 * Carrossel de vídeo do hero.
 *
 * Estratégia de carga: o poster do primeiro slide é o LCP e vem como imagem
 * otimizada; os vídeos só são montados depois da hidratação e cada um só
 * recebe `src` quando chega a sua vez — nada de baixar três arquivos de uma vez.
 * Cada camada de vídeo só ganha opacidade após o `canplay`, então o poster
 * cobre qualquer intervalo de buffering.
 */
export default function HeroCarousel({ children }: HeroCarouselProps) {
  // Começa desligado: sem JS (ou com reduced-motion) fica só o poster.
  const [enabled, setEnabled] = useState(false)
  const [index, setIndex] = useState(0)
  /** Slides que já entraram em cena — só esses recebem `src`. */
  const [loaded, setLoaded] = useState<readonly number[]>([0])
  const [ready, setReady] = useState<readonly number[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(!query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const list = videos.current
    list.forEach((video, i) => {
      if (video && i !== index) video.pause()
    })

    const current = list[index]
    if (!current) return

    // Rebobina ao reentrar no slide (o vídeo anterior terminou no fim).
    if (current.readyState >= 2 && current.currentTime > 0) {
      try {
        current.currentTime = 0
      } catch {
        // Alguns browsers recusam o seek antes do buffer; o play resolve.
      }
    }

    // É o play() que dispara o download de fato (preload="metadata"/"none").
    // Autoplay bloqueado não é erro: o hero permanece no poster.
    void current.play().catch(() => {})
  }, [enabled, index, ready])

  const goTo = useCallback((n: number) => {
    setIndex(n)
    setLoaded((list) => (list.includes(n) ? list : [...list, n]))
  }, [])

  return (
    <section className="hero">
      {POSTER ? (
        <div className="hposter">
          <Image src={POSTER} alt="" fill priority sizes="100vw" />
        </div>
      ) : null}

      {enabled
        ? HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`hslide${i === index && ready.includes(i) ? ' on' : ''}`}
            >
              <video
                ref={(element) => {
                  videos.current[i] = element
                }}
                src={loaded.includes(i) ? slide.src : undefined}
                muted
                playsInline
                preload={i === 0 ? 'metadata' : 'none'}
                tabIndex={-1}
                aria-hidden
                onCanPlay={() =>
                  setReady((list) => (list.includes(i) ? list : [...list, i]))
                }
                onEnded={() => goTo((i + 1) % TOTAL)}
              />
            </div>
          ))
        : null}

      <div className="hov" />

      <div className="hcnt">{children}</div>

      {enabled ? (
        <div className="hdots">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              className="hdot"
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}

      <div className="hscr" aria-hidden>
        <span>Scroll</span>
        <IconArrowDown size={14} />
      </div>
    </section>
  )
}
