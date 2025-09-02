'use client'

import About from './components/about/About'
import Header from './components/header/Header'
import Timeline from './components/timeline/Timeline'
import { useEventsData } from '@/app/helpers/data'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Content from './components/content/Content'

export default function Home() {
  const events = useEventsData()
  const searchParams = useSearchParams()
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
        <Timeline />
      </>
    )
  }
}
