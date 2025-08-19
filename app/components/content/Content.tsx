import styles from './Content.module.css'
import { useSearchParams } from 'next/navigation'
import data from '@/app/data/data.json'
import Image from 'next/image'
import { formatDate } from '@/app/helpers/date'
import { useEffect, useState } from 'react'
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'

type ItemType = {
  id: number
  date: string
  title: string
  description?: string
  images?: ImageType[]
  source?: string
  sounds?: { url: string; alt: string; source?: string }[]
}

type ImageType = {
  url: string
  alt: string
  source?: string
}

export default function Content() {
  const searchParams = useSearchParams()
  const [modalImage, setModalImage] = useState<ImageType | null>(null)

  const selectedItem = data.find((item: ItemType) => item.id === Number(searchParams.get('id')))

  useEffect(() => {
    document.title = selectedItem
      ? `${selectedItem.title} - Atatürk Kronolojisi`
      : 'Atatürk Kronolojisi'
  }, [selectedItem])

  // ESC ile modal kapatma
  useEffect(() => {
    if (!modalImage) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalImage])

  return (
    <SwipeWrapper>
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

        {selectedItem?.images && selectedItem.images.length > 0 && (
          <div className={styles.images}>
            {selectedItem.images.map((image: ImageType, index) => (
              <div
                key={index}
                className={styles.image}
                onClick={() => setModalImage(image)}
                style={{ cursor: 'pointer' }}
              >
                <Image src={image.url} alt='External Image' width={2000} height={2000} />
                <p title={`Bilgi kaynağı: ${image.source}`}>
                  {image.alt}
                  <a href={image.source} target='_blank' rel='noopener noreferrer'>
                    *
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}

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

        {modalImage && (
          <div className={styles.modal} onClick={() => setModalImage(null)}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <button
                className={styles.closeButton}
                onClick={() => setModalImage(null)}
                aria-label='Kapat'
              >
                ×
              </button>

              <Image
                src={modalImage.url}
                alt={modalImage.alt}
                width={800}
                height={800}
                style={{ width: '100%', height: 'auto' }}
              />
              <p title={`Bilgi kaynağı: ${modalImage.source}`}>
                {modalImage.alt}
                {modalImage.source && (
                  <a href={modalImage.source} target='_blank' rel='noopener noreferrer'>
                    {modalImage.source.includes('https://') ? '*' : 'Bilgi Kaynağı'}
                  </a>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </SwipeWrapper>
  )
}
