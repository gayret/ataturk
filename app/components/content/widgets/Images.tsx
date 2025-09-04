import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Images.module.css'
import { useEventsData } from '@/app/helpers/data'
import { useSearchParams } from 'next/navigation'
import { ItemType } from '../Content'

export type ImageType = {
  url: string
  alt: string
  source?: string
}

export default function Images() {
  const [modalImage, setModalImage] = useState<ImageType | null>(null)
  const searchParams = useSearchParams()
  const language = searchParams.get("language")
  const events = useEventsData({ locale: language?.toString() })

  const selectedItem = events.find((item: ItemType) => item.id === Number(searchParams.get('id')))

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
    <div>
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
  )
}
