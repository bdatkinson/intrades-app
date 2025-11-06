import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://intrades-app.vercel.app'),
  title: {
    default: 'InTrades',
    template: '%s | InTrades',
  },
  description: 'Skilled trades building the future',
  openGraph: {
    title: 'InTrades',
    description: 'Skilled trades building the future',
    url: 'https://intrades-app.vercel.app/',
    siteName: 'InTrades',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'InTrades',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InTrades',
    description: 'Skilled trades building the future',
    images: ['/opengraph-image'],
  },
}
