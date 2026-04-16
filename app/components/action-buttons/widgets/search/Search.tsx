import styles from './Search.module.css'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import iconSearch from '../../../../assets/icons/search.svg'
import iconClose from '../../../../assets/icons/close.svg'
import { useLanguageStore } from '@/app/stores/languageStore'

type QuoteLike = string | { text?: string; '-text'?: string; source?: string }

const normalizeQuotes = (quotes: unknown): QuoteLike[] => {
  if (Array.isArray(quotes)) {
    return quotes.filter(
      (quote): quote is QuoteLike => typeof quote === 'string' || !!quote && typeof quote === 'object'
    )
  }

  if (typeof quotes === 'string' || (!!quotes && typeof quotes === 'object')) {
    return [quotes as QuoteLike]
  }

  return []
}

const getQuoteText = (quote: QuoteLike) => {
  if (typeof quote === 'string') return quote
  return quote.text ?? quote['-text'] ?? ''
}

const getQuoteSource = (quote: QuoteLike) => {
  if (typeof quote === 'string') return ''
  return quote.source ?? ''
}

export default function Search() {
  const events = useEventsData()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useState('')
  const [isVisibleResults, setIsVisibleResults] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t, currentLanguageCode } = useLanguageStore()

  const getResultHref = (id: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', id.toString())

    if (!params.get('language')) {
      params.set('language', currentLanguageCode)
    }

    return `/?${params.toString()}`
  }

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

              const quotes = normalizeQuotes(item.quotes)
              const inQuotes = quotes.some((quote) => {
                const quoteText = getQuoteText(quote).toLocaleLowerCase()
                const quoteSource = getQuoteSource(quote).toLocaleLowerCase()

                return quoteText.includes(search) || quoteSource.includes(search)
              })

              return inTitle || inDescription || inDate || inQuotes
            })
            .map((item, index) => {
              const firstQuoteText = getQuoteText(normalizeQuotes(item.quotes)[0] ?? '')

              return (
                <Link
                  href={getResultHref(item.id)}
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
                    <h3>{!item.title && firstQuoteText}</h3>
                    <p>{formatDate(item.date)}</p>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </Link>
              )
            })}
        </div>
      )}
    </div>
  )
}
