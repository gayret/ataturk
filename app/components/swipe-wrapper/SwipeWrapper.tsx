'use client'
import { ReactNode, useCallback, useState } from 'react'
import useEventsData from '@/app/hooks/useEventsData'
import useUpdateQueryParam from '@/app/hooks/useQueryParam'

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
  const { setQueryParam, getQueryParam } = useUpdateQueryParam()
  const currentId = getQueryParam('id')

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
    const currentIndex = events.findIndex((item) => item.id === Number(currentId))
    const prevIndex = (currentIndex - 1 + events.length) % events.length

    setQueryParam('id', events[prevIndex].id.toString())
  }, [events, currentId, setQueryParam])

  const onGoNext = useCallback(() => {
    const currentIndex = events.findIndex((item) => item.id === Number(currentId))
    const nextIndex = (currentIndex + 1) % events.length
    
    setQueryParam('id', events[nextIndex].id.toString())
  }, [events, currentId, setQueryParam])

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
