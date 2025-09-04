'use client'

import styles from './Content.module.css'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/app/helpers/date'
import { useEffect, useState } from 'react'
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import { ImageType } from './widgets/Images'
import Images from './widgets/Images'
import { useEventsData } from '@/app/helpers/data'

export type ItemType = {
  id: number
  date: string
  title: string
  description?: string
  images?: ImageType[]
  source?: string
  sounds?: { url: string; alt: string; source?: string }[]
}

export default function Content() {
  const [computedAge, setComputedAge] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const events = useEventsData()

  const selectedItem = events.find((item: ItemType) => item.id === Number(searchParams.get('id')))

  useEffect(() => {
    document.title = selectedItem
      ? `${selectedItem.title} - Atatürk Kronolojisi`
      : 'Atatürk Kronolojisi'
  }, [selectedItem])

  useEffect(() => {
    setComputedAge(selectedItem?.date ? new Date(selectedItem.date).getFullYear() - 1881 : null)
  }, [selectedItem])

  return (
    <SwipeWrapper>
      <div className={styles.content}>
        <div className={styles.dateAndTitle}>
          <div className={styles.date}>
            {formatDate(selectedItem?.date || '')}
            {computedAge !== null && computedAge > 0 && computedAge <= 57 && (
              <span className={styles.computedAge}>{computedAge}. yaş</span>
            )}
          </div>
          <h1 className={styles.title}>
            {selectedItem?.title}
            {selectedItem?.source && (
              <span className={styles.source} title={`Bilgi kaynağı: ${selectedItem.source}`}>
                <a href={selectedItem.source} target='_blank' rel='noopener noreferrer'>
                  {selectedItem.source.includes('https://') ? '*' : 'Bilgi Kaynağı'}
                </a>
              </span>
            )}
          </h1>

          {selectedItem?.description && (
            <p className={styles.description}>{selectedItem.description}</p>
          )}
        </div>

        <Images />

        {selectedItem?.sounds && selectedItem.sounds.length > 0 && (
          <div className={styles.sounds}>
            {selectedItem.sounds.map((sound, index) => (
              <div key={index} className={styles.sound}>
                <p title={`Bilgi kaynağı: ${sound.source}`}>
                  {sound.alt}
                  {sound.source && (
                    <a href={sound.source} target='_blank' rel='noopener noreferrer'>
                      {sound.source.includes('https://') ? '*' : 'Bilgi Kaynağı'}
                    </a>
                  )}
                </p>

                <audio controls controlsList='nodownload' onContextMenu={(e) => e.preventDefault()}>
                  <source src={sound.url} type='audio/mpeg' />
                  İnternet tarayıcınız ses yürütmeyi desteklemiyor.
                </audio>
              </div>
            ))}
          </div>
        )}
      </div>
    </SwipeWrapper>
  )
}
