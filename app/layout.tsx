import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Barlow } from 'next/font/google'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['100', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atatürk Kronolojisi',
  description:
    "Mustafa Kemal Atatürk'ün hayatını, doğumundan vefatına kadar tüm önemli olayları interaktif bir harita üzerinde kronolojik olarak keşfedin.",
  keywords: [
    'Atatürk',
    'Mustafa Kemal',
    'kronoloji',
    'Türk tarihi',
    'Cumhuriyet',
    'İstiklal Savaşı',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ataturk-kronolojisi.org',
  },
  openGraph: {
    type: 'website',
    url: 'https://ataturk-kronolojisi.org',
    title: 'Atatürk Kronolojisi',
    description:
      "Mustafa Kemal Atatürk'ün hayatını, doğumundan vefatına kadar tüm önemli olayları interaktif bir harita üzerinde kronolojik olarak keşfedin.",
    images: [
      {
        url: 'https://ataturk-kronolojisi.org/images/1910-1940/gelibolu-1915.jpg',
        width: 800,
        height: 600,
        alt: 'Mustafa Kemal Atatürk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atatürk Kronolojisi',
    description:
      "Mustafa Kemal Atatürk'ün hayatını, doğumundan vefatına kadar tüm önemli olayları interaktif bir harita üzerinde kronolojik olarak keşfedin.",
    images: ['https://ataturk-kronolojisi.org/images/1910-1940/gelibolu-1915.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <Suspense>
        <body className={barlow.className}>
          {children}
          <Analytics />
        </body>
      </Suspense>
    </html>
  )
}
