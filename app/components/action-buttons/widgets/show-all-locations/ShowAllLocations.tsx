import styles from './ShowAllLocations.module.css'
import { useSearchParams } from 'next/navigation'
import iconShowAllLocations from '../../../../assets/icons/show-all-locations.svg'
import Image from 'next/image'

export default function ShowAllLocations() {
  const searchParams = useSearchParams()
  const showAllLocations = searchParams.get('show-all-locations') === 'true'

  return (
    <>
      <button
        onClick={() => {
          const params = new URLSearchParams(Array.from(searchParams.entries()))
          if (showAllLocations) {
            params.delete('show-all-locations')
          } else {
            params.set('show-all-locations', 'true')
          }
          const newUrl = `${window.location.pathname}?${params.toString()}`
          window.history.replaceState({}, '', newUrl)
        }}
        className={`${styles.showAllLocations} ${showAllLocations ? styles.active : ''}`}
        title={showAllLocations ? 'Tüm konumları gizle' : 'Tüm konumları göster'}
        aria-pressed={showAllLocations}
      >
        <Image src={iconShowAllLocations} alt='' width={16} height={16} />
      </button>
    </>
  )
}
