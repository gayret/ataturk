import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atatürk Kronolojisi',
    short_name: 'Atatürk',
    description:
      "Mustafa Kemal Atatürk'ün hayatını kronolojik olarak harita ve zaman çizelgesi üzerinde keşfedin.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f0f0f0',
    theme_color: '#f0f0f0',
    lang: 'tr',
    categories: ['education', 'history', 'reference'],
    icons: [
      {
        src: '/pwa-icons/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-icons/512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-icons/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/pwa-icons/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
