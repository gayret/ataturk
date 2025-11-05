import styles from './ActionButtons.module.css'
import { useSearchParams } from 'next/navigation'
import StreetView from './widgets/street-view/StreetView'
import { ItemType } from '../content/Content'
import { useEventsData } from '@/app/helpers/data'
import Share from './widgets/share/Share'
import Direction from './widgets/direction/Direction'
import EventFilter from './widgets/event-filter/EventFilter'
import Search from './widgets/search/Search'
import AutoPlay from './widgets/auto-play/AutoPlay'
import LanguageSelector from './widgets/language-selector/LanguageSelector'
import ToggleImages from './widgets/toggle-images/ToggleImages'

export default function ActionButtons({ showOnlyLanguageSelector = false }: { showOnlyLanguageSelector?: boolean }) {
  const searchParams = useSearchParams()
  const events = useEventsData()

  const selectedItem =
    events.find((item: ItemType) => item.id === Number(searchParams.get('id'))) || events[0]

  if (showOnlyLanguageSelector) {
    return (
      <div className={styles.actionButtons}>
        <LanguageSelector />
      </div>
    )
  }

  return (
    <div className={styles.actionButtons}>
      {
        selectedItem && (
          <>
            <StreetView lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

            <EventFilter />

            <Direction lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

            <Search />

            <ToggleImages />

            <Share />

            <AutoPlay />

            <LanguageSelector />
          </>
        )}
    </div>
  )
}
