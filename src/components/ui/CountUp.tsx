'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** Valor final do contador. */
  value: number
  /** Duração da animação em milissegundos. */
  duration?: number
  className?: string
}

/**
 * Contador animado disparado por IntersectionObserver, uma única vez.
 *
 * O valor final é o que sai do servidor — quem estiver sem JavaScript ou com
 * `prefers-reduced-motion: reduce` lê o número correto; a animação só zera o
 * contador depois da hidratação, e só quando ela realmente vai acontecer.
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) return

    // Nada de zerar aqui: o primeiro frame da animação já entrega 0, e alterar
    // estado direto no corpo do efeito provoca uma renderização em cascata.
    let frame = 0

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.disconnect()

          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // cubic-out
            setDisplay(Math.floor(eased * value))
            if (progress < 1) frame = requestAnimationFrame(tick)
            else setDisplay(value)
          }
          frame = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
