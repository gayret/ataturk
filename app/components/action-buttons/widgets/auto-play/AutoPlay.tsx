'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import autoPlayIcon from '@/app/assets/icons/auto-play.svg'
import Timer from '@/app/components/action-buttons/widgets/auto-play/widgets/timer/Timer'
import { useEventsData } from '@/app/helpers/data'
import { calculateReadingTime } from '@/app/helpers/readingTime'
import styles from './AutoPlay.module.css'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function AutoPlay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const events = useEventsData()
  const { t } = useLanguageStore()

  const speedOptions = [0.5, 1, 1.5, 2]

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
  const [currentTimerMs, setCurrentTimerMs] = useState<number>(0)
  const [totalRemainingMs, setTotalRemainingMs] = useState<number>(0)
  const [localIsActive, setLocalIsActive] = useState<boolean>(false)

  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const initialTotalDurationRef = useRef<number>(0)

  const currentId = searchParams?.get('id')
  const urlIsActive = searchParams?.get('auto-play') === 'true'

  const isActive = localIsActive

  const currentIndex = useMemo(() => {
    return events.findIndex((item) => item.id === Number(currentId))
  }, [events, currentId])

  const eventDurationsMs = useMemo(() => {
    return events.map(
      (event) =>
        calculateReadingTime({
          title: event.title,
          description: event.description,
          quotes: event.quotes,
          images: event.images,
        }) * 1000
    )
  }, [events])

  const currentEventDurationMs = useMemo(() => {
    const effectiveIndex = currentIndex === -1 ? 0 : currentIndex
    return eventDurationsMs[effectiveIndex] || 10000
  }, [eventDurationsMs, currentIndex])

  const totalDurationSeconds = useMemo(() => {
    return Math.round(eventDurationsMs.reduce((total, duration) => total + duration, 0) / 1000)
  }, [eventDurationsMs])

  useEffect(() => {
    setLocalIsActive(urlIsActive)
  }, [urlIsActive])

  useEffect(() => {
    if (isActive && initialTotalDurationRef.current === 0) {
      const startIndex = currentIndex === -1 ? 0 : currentIndex
      const totalMs = eventDurationsMs
        .slice(startIndex)
        .reduce((total, duration) => total + duration, 0)

      initialTotalDurationRef.current = totalMs
      setTotalRemainingMs(totalMs)
    } else if (!isActive) {
      initialTotalDurationRef.current = 0
      setTotalRemainingMs(0)
      setCurrentTimerMs(0)
    }
  }, [isActive, currentIndex, eventDurationsMs])

  useEffect(() => {
    if (isActive) {
      setCurrentTimerMs(currentEventDurationMs)
    }
  }, [currentId, isActive, currentEventDurationMs])

  const formatTime = useCallback(
    (ms: number) => {
      const seconds = Math.ceil(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      if (minutes > 0) {
        return `${minutes}${t.ActionButtons.autoPlayMinutesText} ${remainingSeconds}${t.ActionButtons.autoPlaySecondsText}`
      }

      return `${remainingSeconds}${t.ActionButtons.autoPlaySecondsText}`
    },
    [t.ActionButtons.autoPlayMinutesText, t.ActionButtons.autoPlaySecondsText]
  )

  const getButtonTitle = useCallback(() => {
    if (isActive && isHovering) {
      return `${formatTime(totalRemainingMs)}`
    }

    if (isActive) {
      return `${t.ActionButtons.autoPlayActiveTitle} - ${t.ActionButtons.autoPlayActiveStopTitle}`
    }

    return `${formatTime(totalDurationSeconds * 1000)}`
  }, [
    isActive,
    isHovering,
    totalRemainingMs,
    totalDurationSeconds,
    formatTime,
    t.ActionButtons.autoPlayActiveTitle,
    t.ActionButtons.autoPlayActiveStopTitle,
  ])

  const scrollToStart = useCallback(() => {
    const timelineContainer = document.querySelector('[data-timeline-container]') as HTMLElement
    if (timelineContainer) {
      timelineContainer.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [])

  const stopAutoPlay = useCallback(
    async (shouldScrollToStart: boolean = false) => {
      setLocalIsActive(false)

      const url = new URL(window.location.href)
      url.searchParams.delete('auto-play')
      router.push(url.toString())

      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen()
        } catch (error) {
          console.log('Fullscreen exit error:', error)
        }
      }

      if (shouldScrollToStart) {
        scrollToStart()
      }
    },
    [router, scrollToStart]
  )

  const startAutoPlay = useCallback(async () => {
    setLocalIsActive(true)

    const url = new URL(window.location.href)
    url.searchParams.set('auto-play', 'true')
    router.push(url.toString())

    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen()
      } catch (error) {
        console.log('Fullscreen error:', error)
      }
    }
  }, [router])

  const handleAutoPlayToggle = useCallback(async () => {
    if (isActive) {
      await stopAutoPlay(false)
    } else {
      await startAutoPlay()
    }
  }, [isActive, stopAutoPlay, startAutoPlay])

  const goToNextEvent = useCallback(() => {
    const effectiveCurrentId = currentId || '1'
    const effectiveCurrentIndex = events.findIndex((item) => item.id === Number(effectiveCurrentId))
    const nextIndex = (effectiveCurrentIndex + 1) % events.length

    if (nextIndex === 0) {
      window.history.replaceState({}, '', '/')
      router.push('/')
      setTimeout(() => scrollToStart(), 100)
      return
    }

    const nextEventId = events[nextIndex].id
    const url = new URL(window.location.href)
    url.searchParams.set('id', nextEventId.toString())
    router.push(url.toString())
  }, [currentId, events, router, scrollToStart])

  const handleTimerComplete = useCallback(() => {
    goToNextEvent()
  }, [goToNextEvent])

  const handleTimerProgress = useCallback(
    (_progress: number, remainingMs: number) => {
      setCurrentTimerMs(remainingMs)

      if (initialTotalDurationRef.current > 0) {
        const effectiveIndex = currentIndex === -1 ? 0 : currentIndex
        const futureEventsMs = eventDurationsMs
          .slice(effectiveIndex + 1)
          .reduce((total, duration) => total + duration, 0)

        setTotalRemainingMs(remainingMs + futureEventsMs)
      }
    },
    [currentIndex, eventDurationsMs]
  )

  const handleTimerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      handleAutoPlayToggle()
    },
    [handleAutoPlayToggle]
  )

  const handleSpeedClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      const currentSpeedIndex = speedOptions.indexOf(speedMultiplier)
      const nextSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length

      setSpeedMultiplier(speedOptions[nextSpeedIndex])
    },
    [speedMultiplier, speedOptions]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputElement =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (event.code === 'Space' && currentId !== 'about' && !isInputElement) {
        event.preventDefault()
        handleAutoPlayToggle()
        return
      }

      if (!isInputElement && isActive && event.code !== 'Space') {
        stopAutoPlay(false)
      }
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isAutoPlayButton = target.closest('[data-auto-play-button="true"]')

      if (isAutoPlayButton) {
        return
      }

      if (isActive) {
        stopAutoPlay(false)
      }
    }

    const handleDragStart = () => {
      if (isActive) {
        stopAutoPlay(false)
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        stopAutoPlay(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)
    window.addEventListener('dragstart', handleDragStart)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [currentId, isActive, handleAutoPlayToggle, stopAutoPlay, router])

  return (
    <>
      <Timer
        duration={currentEventDurationMs}
        speedMultiplier={speedMultiplier}
        isActive={isActive}
        onComplete={handleTimerComplete}
        onProgress={handleTimerProgress}
        resetKey={currentId || undefined}
      />

      <div className={styles.container}>
        {/* Main Timer Button */}
        <button
          onClick={handleTimerClick}
          data-auto-play-button='true'
          className={`${styles.timerButton} ${isActive ? styles.active : ''}`}
          onMouseOver={(e) => {
            setIsHovering(true)
            const rect = e.currentTarget.getBoundingClientRect()

            setTooltipPosition({
              x: rect.left + rect.width / 2,
              y: rect.top,
            })

            setShowTooltip(true)
            setTimeout(() => setShowTooltip(false), 1500)
          }}
          onMouseLeave={() => {
            setIsHovering(false)
            setShowTooltip(false)
          }}
        >
          {isActive ? (
            <span className={styles.timerDisplay}>{Math.ceil(currentTimerMs / 1000)}</span>
          ) : (
            <Image
              src={autoPlayIcon}
              alt={t.ActionButtons.autoPlayIconAlt}
              width={16}
              height={16}
            />
          )}
        </button>

        {/* Speed Button */}
        {isActive && (
          <button
            onClick={handleSpeedClick}
            data-auto-play-button='true'
            title={`${t.ActionButtons.autoPlaySpeedTitle} ${speedMultiplier}x - ${t.ActionButtons.autoPlaySpeedChangeTitle}`}
            className={styles.speedButton}
          >
            <span className={styles.speedText}>{speedMultiplier}x</span>
          </button>
        )}
      </div>

      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {getButtonTitle()}
        </div>
      )}
    </>
  )
}
