import type { Metadata } from 'next'
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
  description: "Mustafa Kemal ATATÜRK'ün hayatı",
  keywords: [
    'Atatürk',
    'Mustafa Kemal',
    'kronoloji',
    'Türk tarihi',
    'Cumhuriyet',
    'İstiklal Savaşı',
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ataturk-kronolojisi.org',
  },
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
