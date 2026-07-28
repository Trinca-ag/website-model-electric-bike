import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Barlow, Barlow_Condensed } from 'next/font/google'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/layout/ScrollProgress'
import WhatsappFab from '@/components/layout/WhatsappFab'
import { SITE } from '@/data/site'

import './globals.css'

// Fontes auto-hospedadas pelo next/font: sem request para fonts.googleapis.com,
// sem render-blocking e com fallback métrico (zero CLS).
//
// Os pesos abaixo são exatamente os que o CSS usa — cada peso a mais vira um
// woff2 pré-carregado disputando banda com a imagem de LCP. O subset `latin`
// (U+0000–00FF) já cobre todos os acentos do português; `latin-ext` dobraria o
// número de arquivos sem acrescentar um único glifo usado no site.
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--fd',
})

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--fb',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--fc',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s – ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'bike elétrica',
    'patinete elétrico',
    'prancha elétrica',
    'jetboard',
    'mobilidade elétrica',
    'fat bike elétrica',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#F5F5F3' },
  ],
}

// Aplica o tema salvo antes da primeira pintura — evita o "flash" de tema errado.
const THEME_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('site-theme');if(t!=='light'&&t!=='dark'){t='dark'}d.dataset.theme=t}catch(e){d.dataset.theme='dark'}})()`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${bebas.variable} ${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ScrollProgress />
        <Navbar />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsappFab />
      </body>
    </html>
  )
}
