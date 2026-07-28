import { ImageResponse } from 'next/og'

// Favicon gerado no build a partir do wordmark — dispensa manter um .png à parte.
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          color: '#39FF14',
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        WSM
      </div>
    ),
    size,
  )
}
