'use client'

import { useEffect, useRef } from 'react'

/**
 * Barra de progresso de leitura no topo da página.
 *
 * Usa `transform: scaleX` em vez de `width` — a animação roda no compositor,
 * sem provocar layout/paint a cada evento de scroll. A atualização é agendada
 * em requestAnimationFrame para não rodar mais de uma vez por frame.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div id="prog" ref={barRef} aria-hidden />
}
