'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import Header from '@/app/components/header/Header'
import Timeline from '@/app/components/timeline/Timeline'
import About from '@/app/components/about/About'
import Balloons from '@/app/components/ceremonies/widgets/ballons/Balloons'
import Clouds from '@/app/components/ceremonies/widgets/clouds/Clouds'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import Ceremonies from '@/app/components/ceremonies/Ceremonies'
import Content, { QuoteType } from '@/app/components/content/Content'
import SupportMe from '../support-me/SupportMe'
import GitHubStar from '../github-star/GitHubStar'

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

const SECRET_CODE = 'sadeceharita'

function removeElements() {
  const selectorsByTag = ['header']
  const classKeywords = [
    'Content',
    'ActionButtons',
    'Timeline',
    'GitHubStar',
    'SupportMe',
    'leaflet-control-attribution',
  ]

  selectorsByTag.forEach((tag) => {
    document.querySelectorAll(tag).forEach((el) => el.remove())
  })

  classKeywords.forEach((keyword) => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.classList && el.classList.length > 0) {
        const matches = Array.from(el.classList).some((className) =>
          className.toLowerCase().includes(keyword.toLowerCase()),
        )
        if (matches && document.body.contains(el)) {
          el.remove()
        }
      }
    })
  })
}

export default function HomeClient({ events }: HomeClientProps) {
  const searchParams = useSearchParams()
  const bufferRef = useRef('')

  const currentId = searchParams?.get('id')

  useEffect(() => {
    if (currentId === 'about') return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return

      bufferRef.current = (bufferRef.current + event.key).slice(-SECRET_CODE.length)
      if (bufferRef.current === SECRET_CODE) {
        removeElements()
        document.querySelectorAll('path.leaflet-interactive').forEach((el) => {
          ;(el as HTMLElement).style.stroke = 'red'
          ;(el as HTMLElement).style.strokeWidth = '2px'
        })
        bufferRef.current = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentId])

  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import('@/app/components/map/Map'), {
        ssr: false,
      }),
    [],
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
        <GitHubStar />
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
        <GitHubStar />
      </>
    )
  }
}
