'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Header from '@/app/components/header/Header'
import Timeline from '@/app/components/timeline/Timeline'
import About from '@/app/components/about/About'
import Balloons from '@/app/components/ceremonies/widgets/ballons/Balloons'
import Clouds from '@/app/components/ceremonies/widgets/clouds/Clouds'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import Ceremonies from '@/app/components/ceremonies/Ceremonies'
import Content, { QuoteType } from '@/app/components/content/Content'
import SupportMe from '../support-me/SupportMe'

interface EventImage {
  url: string
  alt: string
  source: string
}

interface EventLocation {
  lat: number
  lon: number
}

interface Event {
  id: number
  title: string
  description?: string | null
  quotes?: QuoteType[]
  date: string
  location: EventLocation
  images: EventImage[]
  source: string
}

interface HomeClientProps {
  events: Event[]
}

export default function HomeClient({ events }: HomeClientProps) {
  const searchParams = useSearchParams()

  const currentId = searchParams?.get('id')

  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import('@/app/components/map/Map'), {
        ssr: false,
      }),
    []
  )

  const selectedEvent = events.find((item) => item.id === Number(currentId)) || events[0]
  const selectedLocation = selectedEvent?.location || events[0]?.location

  if (currentId === 'about') {
    return (
      <>
        <Header />
        <Timeline />
        <About />
        <Balloons />
      </>
    )
  }
  if (currentId !== 'about') {
    return (
      <>
        {currentId !== null && <Clouds />}
        <MapWithNoSSR location={selectedLocation} />
        <Header />
        <Content />
        <ActionButtons />
        <Timeline />
        <Ceremonies />
        <SupportMe />
      </>
    )
  }
}
