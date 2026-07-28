import { ImageResponse } from 'next/og'

import { SITE } from '@/data/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${SITE.name} – ${SITE.tagline}`

const NEON = '#39FF14'
const BLACK = '#0A0A0A'

/**
 * Card de compartilhamento gerado no build (Satori), sem baixar fontes externas:
 * só famílias genéricas, para o build não depender de rede.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: BLACK,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Halo neon atrás do wordmark */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundImage:
              'radial-gradient(circle at 50% 42%, rgba(57,255,20,0.26) 0%, rgba(57,255,20,0.06) 34%, rgba(10,10,10,0) 62%)',
          }}
        />

        {/* Moldura sutil */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            width: 1144,
            height: 574,
            display: 'flex',
            border: '2px solid rgba(57,255,20,0.28)',
            borderRadius: 24,
          }}
        />

        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill={NEON}
          stroke={NEON}
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>

        <div
          style={{
            display: 'flex',
            marginTop: 18,
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 8,
            color: '#FFFFFF',
            lineHeight: 1,
          }}
        >
          WEB SITE&nbsp;<span style={{ color: NEON }}>MODEL</span>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 30,
            width: 300,
            height: 5,
            borderRadius: 999,
            backgroundColor: NEON,
          }}
        />

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 36,
            letterSpacing: 3,
            color: '#F2F2F2',
            textTransform: 'uppercase',
          }}
        >
          {SITE.tagline}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 24,
            letterSpacing: 6,
            color: NEON,
            textTransform: 'uppercase',
          }}
        >
          Bikes · Patinetes · Pranchas
        </div>
      </div>
    ),
    size,
  )
}
