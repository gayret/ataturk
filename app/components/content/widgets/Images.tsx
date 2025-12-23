import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Images.module.css'
import { useEventsData } from '@/app/helpers/data'
import { useSearchParams } from 'next/navigation'
import { ItemType } from '../Content'
import ChevronLeft from '@/app/assets/icons/chevron-left.svg'
import ChevronRight from '@/app/assets/icons/chevron-right.svg'
import { useLanguageStore } from '@/app/stores/languageStore'
import SourceLink from '@/app/components/source-link/SourceLink'

export type ImageType = {
  url: string
  alt: string
  source?: string
}

export default function Images() {
  const { t } = useLanguageStore()
  const events = useEventsData()
  const [modalImage, setModalImage] = useState<ImageType | null>(null)
  const searchParams = useSearchParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImages, setCurrentImages] = useState<ImageType[]>([])

  const selectedItem =
    events.find((item: ItemType) => item.id === Number(searchParams.get('id'))) || events[0]

  // Resimlere tıklanıp modal açılırken çağırılan fonksiyon
  const openModal = (image: ImageType | null) => {
    setModalImage(image)
    if (!selectedItem.images) return
    const imageIndex = selectedItem.images.findIndex((img) => img.url === image?.url)
    setCurrentImageIndex(imageIndex)
    setCurrentImages(selectedItem.images)
  }

  // Önceki resme geçme
  const goToPrevious = () => {
    const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1
    setCurrentImageIndex(prevIndex)
    setModalImage(currentImages[prevIndex])
  }

  // Sonraki resme geçme
  const goToNext = () => {
    const nextIndex = currentImageIndex < currentImages.length - 1 ? currentImageIndex + 1 : 0
    setCurrentImageIndex(nextIndex)
    setModalImage(currentImages[nextIndex])
  }

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
              onClick={() => openModal(image)}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={2000}
                height={2000}
                className={styles.thumb}
              />
              <p title={`${t.InformationSource}: ${image.source}`}>
                {image.alt}
                {image.source && (
                  <SourceLink href={image.source} label={t.InformationSource} />
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalImage && (
        <div
          className={styles.modal}
          onClick={(e) => {
            const element = e.target as HTMLImageElement;
            if (element.classList[0]?.split(" ")[0]?.includes("chevronButton"))
              return;
            setModalImage(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeButton}
            onClick={() => setModalImage(null)}
            aria-label="Kapat"
          >
            &#x2715;
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.imagesWrapper}
          >
            <div
              className={styles.modalContent}
              style={{ position: "relative" }}
            >
              <Image
                src={modalImage.url}
                alt={modalImage.alt}
                width={800}
                height={800}
                className={styles.modalImage}
                style={{ minWidth: "100%", maxWidth: "80dvw", height: "auto" }}
              />
              <p title={`${t.InformationSource}: ${modalImage.source}`}>
                {modalImage.alt}
                {modalImage.source && (
                  <SourceLink
                    href={modalImage.source}
                    label={t.InformationSource}
                  />
                )}
              </p>
            </div>
          </div>

          <div className={styles.chevronContainer} aria-hidden="true">
            <button
              className={styles.chevronButton}
              onClick={() => goToPrevious()}
            >
              <Image src={ChevronLeft} alt="Sol" width={16} height={16} />
            </button>

            <button className={styles.chevronButton} onClick={() => goToNext()}>
              <Image src={ChevronRight} alt="Sağ" width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
