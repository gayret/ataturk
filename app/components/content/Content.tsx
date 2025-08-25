import styles from './Content.module.css'
import { useSearchParams } from 'next/navigation'
import data from '@/app/data/data.json'
import { formatDate } from '@/app/helpers/date'
import { useEffect } from 'react'
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import { ImageType } from './widgets/Images'
import Images from './widgets/Images'
import StreetView from './widgets/StreetView'

export type ItemType = {
  id: number
  date: string
  title: string
  description?: string
  images?: ImageType[]
  source?: string
  sounds?: { url: string; alt: string; source?: string }[]
  streetView?: string
}

export default function Content() {
  const searchParams = useSearchParams()

  const selectedItem = data.find((item: ItemType) => item.id === Number(searchParams.get('id')))

  useEffect(() => {
    document.title = selectedItem
      ? `${selectedItem.title} - Atatürk Kronolojisi`
      : 'Atatürk Kronolojisi'
  }, [selectedItem])

  return (
    <SwipeWrapper>
      {selectedItem?.streetView && <StreetView url={selectedItem?.streetView} />}

      <div className={styles.content}>
        <div className={styles.dateAndTitle}>
          <div className={styles.date}>{formatDate(selectedItem?.date || '')}</div>
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
