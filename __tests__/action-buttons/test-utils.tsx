import React from 'react'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

export type MockEvent = {
  id: number
  title: string
  description?: string
  date: string
  location: {
    lat: number
    lon: number
  }
  quotes?: Array<string | { text?: string; source?: string }>
  images?: Array<{ url: string; alt: string; source?: string }>
  category?: string
}

const translations = {
  ActionButtons: {
    shareTitle: 'Paylas',
    shareIconAlt: 'Paylas ikonu',
    shareText: 'Ataturk Kronolojisi',
    shareLinkedinTitle: 'LinkedIn',
    shareLinkedinIconAlt: 'LinkedIn',
    shareTwitterTitle: 'X',
    shareTwitterIconAlt: 'X',
    shareFacebookTitle: 'Facebook',
    shareFacebookIconAlt: 'Facebook',
    shareWhatsappTitle: 'WhatsApp',
    shareWhatsappIconAlt: 'WhatsApp',
    directionTitle: 'Yol Tarifi',
    directionIconAlt: 'Yol Tarifi',
    eventFilterOpen: 'Filtreyi Ac',
    eventFilterClose: 'Filtreyi Kapat',
    filters: {
      personal: 'Kisisel',
      military: 'Askeri',
      political: 'Siyasi',
      education: 'Egitim',
      reform: 'Reform',
      visit: 'Ziyaret',
    },
    searchTitle: 'Ara',
    searchPlaceholder: 'Ara...',
    searchIconAlt: 'Ara',
    languageSelectorTitle: 'Dil Sec',
    languageSelectorIconAlt: 'Dil Sec',
    streetViewTitle: 'Sokak Gorunumu',
    streetViewIconAlt: 'Sokak Gorunumu',
    editThisContent: 'Icerigi Duzenle',
    autoPlayIconAlt: 'Otomatik Oynat',
    autoPlayMinutesText: 'dk',
    autoPlaySecondsText: 'sn',
    autoPlayActiveTitle: 'Otomatik oynatma acik',
    autoPlayActiveStopTitle: 'Durdurmak icin tikla',
    autoPlaySpeedTitle: 'Hiz',
    autoPlaySpeedChangeTitle: 'Degistir',
  },
  correctOrder: {
    title: 'Dogru Sirayi Bul',
  },
} as const

export const mockSetLanguage = vi.fn()
export const mockRouterReplace = vi.fn()

export const baseEvents: MockEvent[] = [
  {
    id: 1,
    title: 'Selanik',
    description: 'Dogdugu ev',
    date: '1881-01-01T00:00:00.000Z',
    location: { lat: 41.0082, lon: 28.9784 },
    quotes: [{ text: 'Selanik sozu', source: 'Kaynak' }],
    images: [{ url: '/image.jpg', alt: 'Gorsel', source: 'Kaynak' }],
    category: 'personal',
  },
  {
    id: 2,
    title: 'Ankara',
    description: 'Cumhuriyet merkezi',
    date: '1923-10-29T00:00:00.000Z',
    location: { lat: 39.9334, lon: 32.8597 },
    quotes: [{ text: 'Ankara sozu', source: 'Kaynak 2' }],
    category: 'political',
  },
]

let currentSearchParams = new URLSearchParams('id=1&language=tr')
let currentPathname = '/'
let currentEventsData: MockEvent[] = [...baseEvents]
let currentLanguageCode = 'tr'

export function setSearchParams(value: string) {
  currentSearchParams = new URLSearchParams(value)
}

export function setPathname(value: string) {
  currentPathname = value
}

export function setEventsData(value: MockEvent[]) {
  currentEventsData = value
}

export function setLanguageCode(value: string) {
  currentLanguageCode = value
}

export function resetActionButtonMocks() {
  currentSearchParams = new URLSearchParams('id=1&language=tr')
  currentPathname = '/'
  currentEventsData = [...baseEvents]
  currentLanguageCode = 'tr'
  mockSetLanguage.mockReset()
  mockRouterReplace.mockReset()
  window.history.replaceState({}, '', '/?id=1&language=tr')
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    value: null,
  })
}

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src?: string | { src?: string }; alt?: string }) => {
    const resolvedSrc = typeof src === 'string' ? src : (src?.src ?? '')
    return React.createElement('img', { src: resolvedSrc, alt, ...props })
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string | URL; children: React.ReactNode }) => {
    const resolvedHref = typeof href === 'string' ? href : href.toString()
    return React.createElement('a', { href: resolvedHref, ...props }, children)
  },
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
  usePathname: () => currentPathname,
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}))

vi.mock('@/app/helpers/data', () => ({
  useEventsData: () => currentEventsData,
}))

vi.mock('@/app/helpers/date', () => ({
  formatDate: (date: string) => `formatted-${date}`,
}))

vi.mock('@/app/stores/languageStore', () => ({
  availableLanguages: [
    { code: 'tr', name: 'Turkce' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Espanol' },
  ],
  useLanguageStore: () => ({
    currentLanguageCode,
    t: translations,
    setLanguage: mockSetLanguage,
  }),
}))

afterEach(() => {
  cleanup()
  resetActionButtonMocks()
})
