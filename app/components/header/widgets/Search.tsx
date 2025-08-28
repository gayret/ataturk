import styles from './Search.module.css'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function Search() {
  const events = useEventsData()
  const [searchText, setSearchText] = useState('')
  const [isVisibleResults, setIsVisibleResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close the results when clicking outside the search container
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisibleResults(false)
      }
    }
    if (isVisibleResults) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisibleResults])

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
      <input
        type='text'
        placeholder='Arama yapın...'
        value={searchText}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />

      {isVisibleResults && (
        <div className={styles.resultsContainer}>
          {events
            .filter(
              (item) =>
                item.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
                (item.description &&
                  item.description.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
            )
            .map((item, index) => (
              <Link
                href={`/?id=${item.id}`}
                onClick={() => setIsVisibleResults(false)}
                className={styles.resultLink}
                key={index}
              >
                <div key={index} className={styles.resultItem}>
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
