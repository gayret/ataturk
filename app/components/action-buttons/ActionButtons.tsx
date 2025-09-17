import styles from './ActionButtons.module.css'
import { useSearchParams } from 'next/navigation'
import StreetView from './widgets/street-view/StreetView'
import { ItemType } from '../content/Content'
import useEventsData from '@/app/hooks/useEventsData'
import Share from './widgets/share/Share'
import Direction from './widgets/direction/Direction'
import ShowAllLocations from './widgets/show-all-locations/ShowAllLocations'
import Search from './widgets/search/Search'

export default function ActionButtons() {
  const searchParams = useSearchParams()
  const events = useEventsData()

  const selectedItem =
    events.find((item: ItemType) => item.id === Number(searchParams.get('id'))) || events[0]

  return (
    <div className={styles.actionButtons}>
      {selectedItem && (
        <>
          <StreetView lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

          <ShowAllLocations />

          <Direction lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

          <Search />

          <Share />
        </>
      )}
    </div>
  )
}
