import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './EventFilter.module.css'
import filterIcon from '../../../../assets/icons/event-filter.svg'
import EventTypes from '@/app/constants/EventTypes'

export default function EventFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleClick = (label: string) => {
    const params = new URLSearchParams(searchParams.toString())
    // Mevcut değerleri array’e al
    const currentValues = params.get('displayed-locations')?.split(',') || []
    let newValues: string[]
    if (currentValues.includes(label)) {
      // varsa çıkar
      newValues = currentValues.filter((val) => val !== label)
    } else {
      // yoksa ekle
      newValues = [...currentValues, label]
    }
    if (newValues.length > 0) {
      params.set('displayed-locations', newValues.join(','))
    } else {
      params.delete('displayed-locations')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Eğer kullanıcı sayfanın dışına tıklarsa open'ı false yap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const shareElement = document.querySelector(`.${styles.filter}`)
      if (shareElement && !shareElement.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.filter}>
      <button onClick={() => setOpen(!open)} title={open ? 'Filtreleri kapat' : 'Filtreleri aç'}>
        <Image src={filterIcon} alt='' width={16} height={16} />
      </button>

      {open && (
        <div className={styles.opened}>
          {EventTypes.map((eventType) => {
            const isActive = searchParams.get('displayed-locations')?.split(',').includes(eventType.title)
            return (
              <button
              type='button'
                key={eventType?.id}
                className={`${styles.filterItemWrapper} ${isActive ? styles.activeFilterItemWrapper : ''}`}
                title={eventType?.label}
                onClick={() => handleClick(eventType.title)}
              >
                <Image
                  src={eventType?.icon}
                  alt={eventType?.label}
                  width={16}
                  height={16}
                  className={styles.filterItemIcon}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
