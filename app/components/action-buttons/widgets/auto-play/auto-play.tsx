'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import autoPlayIcon from '@/app/assets/icons/auto-play.svg'
import Timer from '@/app/components/action-buttons/widgets/auto-play/widgets/timer/Timer'
import { useEventsData } from '@/app/helpers/data'
import { calculateReadingTime } from '@/app/helpers/readingTime'

export default function AutoPlay() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const events = useEventsData()

    const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
    const [currentTimerMs, setCurrentTimerMs] = useState<number>(0)
    const [totalRemainingMs, setTotalRemainingMs] = useState<number>(0)
    const [localIsActive, setLocalIsActive] = useState<boolean>(false)

    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [showTooltip, setShowTooltip] = useState<boolean>(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

    const initialTotalDurationRef = useRef<number>(0)

    const speedOptions = [0.5, 1, 1.5, 2]

    const currentId = searchParams?.get('id')
    const urlIsActive = searchParams?.get('auto-play') === 'true'
    
    const isActive = localIsActive

    const currentIndex = useMemo(() => {
        return events.findIndex(item => item.id === Number(currentId))
    }, [events, currentId])

    const eventDurationsMs = useMemo(() => {
        return events.map(event => calculateReadingTime({
            title: event.title,
            description: event.description,
            quotes: event.quotes,
            images: event.images
        }) * 1000)
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

    const formatTime = useCallback((ms: number) => {
        const seconds = Math.ceil(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        if (minutes > 0) {
            return `${minutes}dk ${remainingSeconds}s`
        }
        return `${remainingSeconds}s`
    }, [])

    const getButtonTitle = useCallback(() => {
        if (isActive && isHovering) {
            return `${formatTime(totalRemainingMs)}`
        }
        if (isActive) {
            return `Otomatik geçiş aktif - Durdur (Space)`
        }
        return `${formatTime(totalDurationSeconds * 1000)}`
    }, [isActive, isHovering, totalRemainingMs, totalDurationSeconds, formatTime])

    const scrollToStart = useCallback(() => {
        const timelineContainer = document.querySelector('[data-timeline-container]') as HTMLElement
        if (timelineContainer) {
            timelineContainer.scrollTo({ left: 0, behavior: 'smooth' })
        }
    }, [])

    const stopAutoPlay = useCallback(async (shouldScrollToStart: boolean = false) => {
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
    }, [router, scrollToStart])

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
        const effectiveCurrentIndex = events.findIndex(item => item.id === Number(effectiveCurrentId))
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

    const handleTimerProgress = useCallback((_progress: number, remainingMs: number) => {
        setCurrentTimerMs(remainingMs)

        if (initialTotalDurationRef.current > 0) {
            const effectiveIndex = currentIndex === -1 ? 0 : currentIndex
            const futureEventsMs = eventDurationsMs
                .slice(effectiveIndex + 1)
                .reduce((total, duration) => total + duration, 0)

            setTotalRemainingMs(remainingMs + futureEventsMs)
        }
    }, [currentIndex, eventDurationsMs])

    const handleTimerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        handleAutoPlayToggle()
    }, [handleAutoPlayToggle])

    const handleSpeedClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        const currentSpeedIndex = speedOptions.indexOf(speedMultiplier)
        const nextSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length
        setSpeedMultiplier(speedOptions[nextSpeedIndex])
    }, [speedMultiplier, speedOptions])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            const isInputElement = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable

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

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
            }}>
                {/* Main Timer Button */}
                <button
                    onClick={handleTimerClick}
                    data-auto-play-button="true"
                    style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        transition: 'all 0.2s ease-in-out',
                        backdropFilter: 'blur(5px)',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                        boxShadow: isActive ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                        setIsHovering(true)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltipPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                        })
                        setTimeout(() => setShowTooltip(true), 300)

                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)'
                            e.currentTarget.style.transform = 'scale(1.1)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        setIsHovering(false)
                        setShowTooltip(false)

                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.transform = 'scale(1)'
                        }
                    }}
                >
                    {isActive ? (
                        <span style={{
                            color: 'black',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            minWidth: '16px',
                            textAlign: 'center',
                            display: 'inline-block',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                        }}>
                            {Math.ceil(currentTimerMs / 1000)}
                        </span>
                    ) : (
                        <Image src={autoPlayIcon} alt='Otomatik Geçiş Iconu' width={16} height={16} />
                    )}
                </button>

                {/* Speed Button */}
                <button
                    onClick={handleSpeedClick}
                    data-auto-play-button="true"
                    title={`Hız: ${speedMultiplier}x - Tıkla değiştir`}
                    style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        padding: '2px 6px',
                        minWidth: '24px',
                        height: '16px',
                        transition: 'all 0.2s ease-in-out',
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        opacity: 1
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    <span style={{
                        color: 'black',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                    }}>
                        {speedMultiplier}x
                    </span>
                </button>
            </div>

            {/* Custom Tooltip */}
            {showTooltip && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translateX(-50%) translateY(-100%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        zIndex: 10000,
                        pointerEvents: 'none',
                        maxWidth: '250px'
                    }}
                >
                    {getButtonTitle()}
                </div>
            )}
        </>
    )
}