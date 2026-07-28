'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import Logo from '@/components/layout/Logo'
import { NAV_LINKS, SITE } from '@/data/site'

const THEME_KEY = 'site-theme'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Estado "scrolled" — passivo e sem trabalho por frame além de um booleano.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 60)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Trava o scroll do body enquanto o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Esc fecha o menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Modo privativo / storage bloqueado: o tema simplesmente não persiste.
    }
  }, [])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
        <Link
          href="/"
          className="logo-link"
          aria-label={`${SITE.name} — página inicial`}
        >
          <Logo className="nav-logo" />
        </Link>

        <ul className="nav-links" id="nav-menu">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? 'active' : undefined}
                // `page` só na rota exata: em /produtos/bikes o link "Produtos"
                // continua destacado visualmente, mas sem se anunciar como a
                // página atual — dois aria-current="page" confundem o leitor.
                aria-current={pathname === link.href ? 'page' : undefined}
                // Fecha o menu no clique. Fazer isso via efeito na mudança de
                // rota causaria uma renderização em cascata desnecessária — e
                // links de âncora (/#unidades) nem sempre mudam o pathname.
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-acts">
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Alternar entre modo claro e escuro"
          />
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </nav>

      <button
        type="button"
        className={`nav-backdrop${open ? ' on' : ''}`}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        aria-hidden
      />
    </>
  )
}
