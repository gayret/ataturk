'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import Header from '@/app/components/header/Header'
import Timeline, { TimelineRef } from '@/app/components/timeline/Timeline'
import About from '@/app/components/about/About'
import Balloons from '@/app/components/ceremonies/widgets/ballons/Balloons'
import Clouds from '@/app/components/ceremonies/widgets/clouds/Clouds'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import Ceremonies from '@/app/components/ceremonies/Ceremonies'
import Content from '@/app/components/content/Content'
import SupportMe from '../support-me/SupportMe'
import Timer from '@/app/components/timer/Timer'
import AutoSwitch from '@/app/components/action-buttons/widgets/auto-switch/auto-switch'
import { calculateReadingTime } from '@/app/helpers/readingTime'

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
  quote?: string | null
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
  const [isAutoSwitchActive, setIsAutoSwitchActive] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
  const timelineRef = useRef<TimelineRef>(null)

  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import('@/app/components/map/Map'), {
        ssr: false,
      }),
    []
  )

  const currentId = searchParams?.get('id')
  const selectedEvent = events.find((item) => item.id === Number(currentId)) || events[0]
  const selectedLocation = selectedEvent?.location || events[0]?.location
  
  const baseDuration = useMemo(() => {
    if (selectedEvent) {
      return calculateReadingTime({
        title: selectedEvent.title,
        description: selectedEvent.description,
        quote: selectedEvent.quote,
        images: selectedEvent.images
      })
    }
    return 10
  }, [selectedEvent])

  const timerDuration = useMemo(() => {
    return Math.round(baseDuration / speedMultiplier)
  }, [baseDuration, speedMultiplier])

  const stopAutoSwitchAndExitFullscreen = async () => {
    setIsAutoSwitchActive(false)
    setRemainingSeconds(0)
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (error) {
        console.log('Fullscreen exit error:', error)
      }
    }
  }

  const handleAutoSwitchToggle = useCallback(async (isActive: boolean) => {
    if (isActive) {
      setRemainingSeconds(timerDuration)
      setIsAutoSwitchActive(true)
      
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen()
        } catch (error) {
          console.log('Fullscreen error:', error)
        }
      }
    } else {
      await stopAutoSwitchAndExitFullscreen()
    }
  }, [timerDuration])

  const handleTimerComplete = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.goNext()
    }
  }, [])

  const handleTimerProgress = useCallback((_progress: number, remainingSeconds: number) => {
    setRemainingSeconds(remainingSeconds)
  }, [])

  const handleSpeedChange = useCallback((speed: number) => {
    setSpeedMultiplier(speed)
  }, [])



  const handleTimelineEndReached = useCallback(async () => {
    await stopAutoSwitchAndExitFullscreen()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputElement = target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (event.code === 'Space' && currentId !== 'about' && !isInputElement) {
        event.preventDefault()
        handleAutoSwitchToggle(!isAutoSwitchActive)
        return
      }

      if (!isInputElement && isAutoSwitchActive && event.code !== 'Space') {
        stopAutoSwitchAndExitFullscreen()
      }
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isAutoSwitchButton = target.closest('[data-auto-switch-button="true"]')
      
      if (isAutoSwitchButton) {
        return
      }

      if (isAutoSwitchActive) {
        stopAutoSwitchAndExitFullscreen()
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isAutoSwitchButton = target.closest('[data-auto-switch-button="true"]')
      
      if (isAutoSwitchButton) {
        return
      }

      if (isAutoSwitchActive) {
        stopAutoSwitchAndExitFullscreen()
      }
    }

    const handleDragStart = () => {
      if (isAutoSwitchActive) {
        stopAutoSwitchAndExitFullscreen()
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isAutoSwitchActive) {
        setIsAutoSwitchActive(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('dragstart', handleDragStart)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [currentId, isAutoSwitchActive])

  if (currentId === 'about') {
    return (
      <>
        <Header />
        <Timeline ref={timelineRef} onEndReached={handleTimelineEndReached} />
        <About />
        <Balloons />
      </>
    )
  }
  if (currentId !== 'about') {
    return (
      <>
        <Timer
          duration={baseDuration * 1000}
          speedMultiplier={speedMultiplier}
          isActive={isAutoSwitchActive}
          onComplete={handleTimerComplete}
          onProgress={handleTimerProgress}
        />
        {currentId !== null && <Clouds />}
        <MapWithNoSSR key="main-map" location={selectedLocation} />
        <Header />
        <Content />
        <ActionButtons />
        <AutoSwitch
          onToggle={handleAutoSwitchToggle}
          isActive={isAutoSwitchActive}
          remainingSeconds={remainingSeconds}
          duration={baseDuration}
          speedMultiplier={speedMultiplier}
          onSpeedChange={handleSpeedChange}
        />
        <Timeline ref={timelineRef} onEndReached={handleTimelineEndReached} />
        <Ceremonies />
        <SupportMe />
      </>
    )
  }
}
