import styles from './Search.module.css'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import iconSearch from '../../../../assets/icons/search.svg'
import iconClose from '../../../../assets/icons/close.svg'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function Search() {
  const events = useEventsData()
  const [searchText, setSearchText] = useState('')
  const [isVisibleResults, setIsVisibleResults] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguageStore()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisibleResults(false)
        setIsSearchOpen(false)
      }
    }

    if (isVisibleResults) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisibleResults, isSearchOpen])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setIsVisibleResults(false)
    } else {
      setIsVisibleResults(true)
    }
    setSearchText(event.target.value)
  }

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <button
        onClick={() => {
          setIsSearchOpen((prev) => !prev)
          setIsVisibleResults(false)
        }}
        className={styles.searchButton}
        title={t.ActionButtons.searchTitle}
      >
        {isSearchOpen ? (
          <Image src={iconClose} alt={t.ActionButtons.searchIconAlt} width={16} height={16} />
        ) : (
          <Image src={iconSearch} alt={t.ActionButtons.searchIconAlt} width={16} height={16} />
        )}
      </button>

      {isSearchOpen && (
        <input
          type='text'
          placeholder={t.ActionButtons.searchPlaceholder}
          value={searchText}
          onChange={handleSearchChange}
          autoFocus
          className={styles.searchInput}
        />
      )}

      {isVisibleResults && (
        <div className={styles.resultsContainer}>
          {events
            .filter((item) => {
              const search = searchText.toLocaleLowerCase()

              const inTitle = item.title.toLocaleLowerCase().includes(search)

              const inDescription =
                item.description && item.description.toLocaleLowerCase().includes(search)

              const inDate = formatDate(item.date).toLocaleLowerCase().includes(search)

              const inQuotes =
                item.quotes &&
                item.quotes.some(
                  (q) =>
                    q.text.toLocaleLowerCase().includes(search) ||
                    q.source.toLocaleLowerCase().includes(search)
                )

              return inTitle || inDescription || inDate || inQuotes
            })
            .map((item, index) => (
              <Link
                href={`/?id=${item.id}`}
                onClick={() => {
                  setIsVisibleResults(false)
                  setIsSearchOpen(false)
                  setSearchText('')
                }}
                className={styles.resultLink}
                key={index}
              >
                <div className={styles.resultItem}>
                  <h3>{item.title}</h3>
                  <h3>{!item.title && item.quotes && item.quotes[0].text}</h3>
                  <p>{formatDate(item.date)}</p>
                  {item.description && <p>{item.description}</p>}
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}
