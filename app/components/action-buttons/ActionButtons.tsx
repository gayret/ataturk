import styles from './ActionButtons.module.css'
import { useSearchParams } from 'next/navigation'
import StreetView from './widgets/street-view/StreetView'
import { ItemType } from '../content/Content'
import { useEventsData } from '@/app/helpers/data'
import Share from './widgets/share/Share'
import Direction from './widgets/direction/Direction'

export default function ActionButtons() {
  const searchParams = useSearchParams()
  const events = useEventsData()

  const selectedItem = events.find((item: ItemType) => item.id === Number(searchParams.get('id')))

  return (
    <div className={styles.actionButtons}>
      {selectedItem && (
        <>
          <StreetView lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

          <Direction lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

          <Share />
        </>
      )}
    </div>
  )
}
