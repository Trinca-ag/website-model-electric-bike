'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  id?: string
}

/**
 * Aplica o scroll-reveal aos filhos que tiverem a classe `.rev`.
 *
 * O wrapper é o único componente de cliente envolvido — os cards continuam
 * sendo Server Components e não mandam JavaScript nenhum para o navegador.
 * Um único IntersectionObserver cobre todos os filhos e se desconecta do
 * elemento assim que ele aparece (o reveal só precisa acontecer uma vez).
 */
export default function Reveal({ children, className, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.rev'))
    if (targets.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('vis'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('vis')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // `children` como dependência: sem isso o observer era recriado a cada
    // render — no catálogo, a cada tecla digitada num filtro de preço.
  }, [children])

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  )
}
