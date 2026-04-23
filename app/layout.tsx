import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Barlow } from 'next/font/google'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import PWARegister from '@/app/components/pwa/PWARegister'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['100', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atatürk Kronolojisi',
  applicationName: 'Atatürk Kronolojisi',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Atatürk Kronolojisi',
  },
  description:
    "Mustafa Kemal Atatürk'ün hayatını, doğumundan vefatına kadar tüm önemli olayları interaktif bir harita üzerinde kronolojik olarak keşfedin.",
  metadataBase: new URL('https://ataturk-kronolojisi.org'),
  manifest: '/manifest.webmanifest',
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
  icons: {
    icon: [
      {
        url: '/icon',
        type: 'image/png',
      },
      {
        url: '/pwa-icons/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/pwa-icons/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/icon'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f0f0f0',
}

// Structured data (JSON-LD for SEO rich results)
const ldData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Atatürk Kronolojisi',
  url: 'https://ataturk-kronolojisi.org',
  description:
    "Mustafa Kemal Atatürk'ün hayatını, doğumundan vefatına kadar tüm önemli olayları interaktif bir harita üzerinde kronolojik olarak keşfedin.",
  inLanguage: 'tr',
  publisher: {
    '@type': 'Organization',
    name: 'Atatürk Kronolojisi',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldData),
          }}
        />
      </head>
      <body className={barlow.className}>
        <Suspense>{children}</Suspense>
        <PWARegister />
        <Analytics />
      </body>
    </html>
  )
}
