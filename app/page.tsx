'use client'

import About from './components/about/About'
import Header from './components/header/Header'
import Timeline from './components/timeline/Timeline'
import { useEventsData } from '@/app/helpers/data'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Content from './components/content/Content'
import ActionButtons from './components/action-buttons/ActionButtons'
import Ceremonies from './components/ceremonies/Ceremonies'
import Balloons from './components/ballons/Balloons'

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

  // Eğer searchParams 'about' ise
  if (searchParams.get('id') === 'about') {
    return (
      <>
        <Header />
        <Timeline />
        <About />
        <Balloons />
      </>
    )
  }

  // Eğer searchParams 'about' değilse ve null değilse, normal render et
  if (searchParams.get('id') !== 'about') {
    return (
      <>
        <MapWithNoSSR
          location={
            events.find((item) => item.id === Number(searchParams.get('id')))?.location ||
            events[0].location!
          }
        />
        <Header />
        <Content />
        <ActionButtons />
        <Timeline />
        <Ceremonies />
      </>
    )
  }
}
