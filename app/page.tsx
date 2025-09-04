'use client'

import About from '@/app/components/about/About'
import Header from '@/app/components/header/Header'
import Timeline from '@/app/components/timeline/Timeline'
import { useEventsData } from '@/app/helpers/data'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Content from '@/app/components/content/Content'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import { useLanguageStore } from './stores/languageStore'

export default function Home() {
  const searchParams = useSearchParams()
  const { setLanguage } = useLanguageStore()
  const events = useEventsData()
  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import('@/app/components/map/Map'), {
        ssr: false,
      }),
    []
  )

  // Eğer id yoksa, searchParams'a id=1 ekle
  if (typeof window !== 'undefined' && searchParams.get('id') === null) {
    const params = new URLSearchParams(window.location.search)
    params.set('id', '1')
    window.location.search = params.toString()
    return null
  }

  // Eğer language yoksa, tarayıcı diline göre searchParams'a language ekle
  if (typeof window !== 'undefined' && searchParams.get('language') === null) {
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'tr').toLowerCase()
    const normalized = browserLang.startsWith('tr') ? 'tr' : browserLang.startsWith('en') ? 'en' : 'tr'
    const params = new URLSearchParams(window.location.search)
    params.set('language', normalized)
    window.location.search = params.toString()
    return null
  }

  // URL'deki language değiştiğinde yeni değeri oku ve language store'a ayarla
  const language = searchParams.get('language')
  useEffect(() => {
    setLanguage(language?.toString() || 'tr')
  }, [language])

  // Eğer searchParams 'about' ise
  if (searchParams.get('id') === 'about') {
    return (
      <>
        <Header />
        <Timeline />
        <About />
      </>
    )
  }

  // Eğer searchParams 'about' değilse ve null değilse, normal render et
  if (searchParams.get('id') !== 'about' && searchParams.get('id') !== null) {
    return (
      <>
        <MapWithNoSSR
          location={
            events.find((item) => item.id === Number(searchParams.get('id')))?.location || {
              lat: 0,
              lon: 0,
            }
          }
        />
        <Header />
        <Content />
        <ActionButtons />
        <Timeline />
      </>
    )
  }
}
