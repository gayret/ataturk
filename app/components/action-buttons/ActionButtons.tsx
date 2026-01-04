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
import { useState } from 'react'
import EditThisContent from './widgets/edit-this-content/EditThisContent'
import hamburgerButtonIcon from '@/app/assets/icons/hamburger-button.svg'
import close from '@/app/assets/icons/close.svg'
import Image from 'next/image'

export default function ActionButtons({
  showOnlyLanguageSelector = false,
}: {
  showOnlyLanguageSelector?: boolean
}) {
  const searchParams = useSearchParams()
  const events = useEventsData()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      <div className={`${styles.buttonsWrapper} ${isMenuOpen ? styles.open : ''}`}>
        {selectedItem && (
          <>
            <StreetView lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

            <EventFilter />

            <Direction lat={selectedItem?.location.lat} lon={selectedItem?.location.lon} />

            <Search />

            <Share />

            <AutoPlay />

            <LanguageSelector />

            <EditThisContent />
          </>
        )}
      </div>
      <div
        className={styles.hamburgerButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label='Menüyü aç/kapat'
      >
        <Image
          width={24}
          height={24}
          src={isMenuOpen ? close : hamburgerButtonIcon}
          alt={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        />
      </div>
    </div>
  )
}
