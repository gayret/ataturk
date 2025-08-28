'use client'
import { ReactNode, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEventsData } from '@/app/helpers/data'

type SwipeWrapperProps = {
  children: ReactNode
  minSwipeDistance?: number
  onlyNext?: boolean
}

export default function SwipeWrapper({
  children,
  onlyNext,
  minSwipeDistance = 50,
}: SwipeWrapperProps) {
  const events = useEventsData()
  const searchParams = useSearchParams()

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const onGoPrev = useCallback(() => {
    const url = new URL(window.location.href)
    const currentId = searchParams.get('id')
    const currentIndex = events.findIndex((item) => item.id === Number(currentId))
    const prevIndex = (currentIndex - 1 + events.length) % events.length
    url.searchParams.set('id', events[prevIndex].id.toString())
    window.history.pushState({}, '', url.toString())
  }, [searchParams, events])

  const onGoNext = useCallback(() => {
    const url = new URL(window.location.href)
    const currentId = searchParams.get('id')
    const currentIndex = events.findIndex((item) => item.id === Number(currentId))
    const nextIndex = (currentIndex + 1) % events.length
    url.searchParams.set('id', events[nextIndex].id.toString())
    window.history.pushState({}, '', url.toString())
  }, [searchParams, events])

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchEndX - touchStartX

    if (distance > minSwipeDistance) {
      if (onlyNext) {
        onGoNext()
      } else {
        onGoPrev()
      }
    }

    if (distance < -minSwipeDistance) {
      onGoNext()
    }
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}
