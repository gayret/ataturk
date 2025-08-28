'use client'

import styles from './Timeline.module.css'
import { useEventsData } from '@/app/helpers/data'
import { getYear } from '@/app/helpers/date'
import { useSearchParams } from 'next/navigation'
import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

import chevronLeft from '@/app/assets/icons/chevron-left.svg'
import chevronRight from '@/app/assets/icons/chevron-right.svg'

export default function Timeline() {
  const events = useEventsData()
  const searchParams = useSearchParams()

  const timelineContainerRef = useRef<HTMLDivElement>(null)

  // group by year and get unique years
  const groupedByYear = events.reduce((acc, item) => {
    const year = getYear(item.date)
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(item)
    return acc
  }, {} as Record<string, typeof events>)

  const uniqueYears = Object.entries(groupedByYear).map(([year, items]) => ({
    year: year,
    ids: items.map((item) => item.id),
    items,
  }))

  useEffect(() => {}, [searchParams])

  const onOpenId = (id: number) => () => {
    const url = new URL(window.location.href)
    url.searchParams.set('id', id.toString())
    window.history.pushState({}, '', url.toString())
  }

  useEffect(() => {
    if (timelineContainerRef.current) {
      const activeButton = timelineContainerRef.current.querySelector(`.${styles.active}`)

      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [searchParams])

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

  useEffect(() => {
    // Handle keyboard navigation for left and right arrows
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Element | null

      if (target?.className?.toString().includes('timelineItem')) {
        // Prevent default action for arrow keys when focused on timeline items
        event.preventDefault()
      }

      if (event.key === 'ArrowLeft') {
        onGoPrev()
      } else if (event.key === 'ArrowRight') {
        onGoNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onGoPrev, onGoNext])

  useEffect(() => {
    // Handle horizontal scrolling with mouse wheel
    const container = timelineContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Shift tuşuna basılmadıysa scroll yönünü yataya çevir
      if (!e.shiftKey) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <section className={styles.timeline}>
      <button className={styles.actionButton} onClick={onGoPrev}>
        <Image src={chevronLeft} alt='Önceki' width={24} height={24} />
      </button>

      <div className={styles.timelineContainer} ref={timelineContainerRef}>
        {uniqueYears.map((item, index) => {
          const activeId = Number(searchParams.get('id'))
          const isActiveYear = item.ids.includes(activeId)

          return (
            <div
              key={index}
              role='button'
              tabIndex={0}
              onClick={() => onOpenId(item.ids[0])()}
              className={`${styles.timelineItem} ${isActiveYear ? styles.active : ''}`}
              aria-label={`Go to ${item.year} section`}
              data-year={item.year}
              style={{
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                cursor: 'pointer',
              }}
            >
              {isActiveYear && item.items.length > 1 && (
                <div className={styles.dotsWrapperFromTop}>
                  {item.items.map((subItem) => (
                    <span
                      key={subItem.id}
                      className={`${styles.dot} ${subItem.id === activeId ? styles.dotActive : ''}`}
                      title={subItem.title}
                      role='button'
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenId(subItem.id)()
                      }}
                    ></span>
                  ))}
                </div>
              )}
              <div className={styles.timelineDate}>{item.year}</div>

              {isActiveYear && item.items.length > 1 && (
                <div className={styles.dotsWrapperFromBottom}>
                  {item.items.map((subItem) => (
                    <span
                      key={subItem.id}
                      className={`${styles.dot} ${subItem.id === activeId ? styles.dotActive : ''}`}
                      title={subItem.title}
                      role='button'
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenId(subItem.id)()
                      }}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button className={styles.actionButton} onClick={onGoNext}>
        <Image src={chevronRight} alt='Sonraki' width={24} height={24} />
      </button>
    </section>
  )
}
