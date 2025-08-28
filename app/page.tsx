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

  return searchParams.get('id') === null ? (
    <>
      <Header />
      <Timeline />
      <About />
    </>
  ) : (
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
