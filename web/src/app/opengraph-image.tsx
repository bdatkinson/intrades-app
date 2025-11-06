/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00e1ff, #16f2b3 40%, #ff6b00 100%)',
          color: '#0b0b0b',
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -1,
          textShadow: '0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        InTrades
      </div>
    ),
    {
      ...size,
    }
  )
}
