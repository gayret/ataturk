import styles from './Search.module.css'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import iconSearch from '../../../../assets/icons/search.svg'
import iconClose from '../../../../assets/icons/close.svg'

export default function Search() {
  const events = useEventsData()
  const [searchText, setSearchText] = useState('')
  const [isVisibleResults, setIsVisibleResults] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
        title='Arama'
      >
        {isSearchOpen ? (
          <Image src={iconClose} alt='Arama ikonu' width={16} height={16} />
        ) : (
          <Image src={iconSearch} alt='Arama ikonu' width={16} height={16} />
        )}
      </button>

      {isSearchOpen && (
        <input
          type='text'
          placeholder='Arama yapın...'
          value={searchText}
          onChange={handleSearchChange}
          autoFocus
          className={styles.searchInput}
        />
      )}

      {isVisibleResults && (
        <div className={styles.resultsContainer}>
          {events
            .filter(
              (item) =>
                item.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                (item.description &&
                  item.description.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) ||
                (formatDate(item.date).toLocaleLowerCase() &&
                  formatDate(item.date).toLocaleLowerCase().includes(searchText))
            )
            .map((item, index) => (
              <Link
                href={`/?id=${item.id}`}
                onClick={() => {
                  setIsVisibleResults(false)
                  setIsSearchOpen(false)
                }}
                className={styles.resultLink}
                key={index}
              >
                <div className={styles.resultItem}>
                  <h3>{item.title}</h3>
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
