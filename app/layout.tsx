import type { Metadata } from 'next'
import './globals.css'
import { Barlow } from 'next/font/google'
import { Suspense } from 'react'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['100', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atatürk Kronolojisi',
  description: "Mustafa Kemal ATATÜRK'ün hayatı",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <Suspense>
        <body className={barlow.className}>{children}</body>
      </Suspense>
    </html>
  )
}
