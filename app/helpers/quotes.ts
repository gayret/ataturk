import eventsTr from '@/app/json/events_tr.json'
import eventsEn from '@/app/json/events_en.json'
import eventsDe from '@/app/json/events_de.json'

type Language = 'tr' | 'en' | 'de'

type RawEventImage = {
  url: string
  alt: string
  source?: string
}

type RawEventQuote = {
  text: string
  source?: string
}

type RawEvent = {
  id: number
  date: string
  title: string
  description?: string
  quotes?: RawEventQuote[]
  images?: RawEventImage[]
  category?: string
}

export type QuoteRecord = {
  id: string
  eventId: number
  date: string
  title: string
  description?: string
  quote: string
  source?: string
  language: Language
  eventCategory?: string
  image?: RawEventImage | null
}

export type QuoteQuery = {
  quoteId?: string | null
  eventId?: number | null
  date?: string | null
  random?: boolean
  count?: number
}

const datasets: Record<Language, RawEvent[]> = {
  tr: eventsTr as RawEvent[],
  en: eventsEn as RawEvent[],
  de: eventsDe as RawEvent[],
}

const quoteCache: Record<Language, QuoteRecord[]> = {
  tr: buildQuoteDataset('tr'),
  en: buildQuoteDataset('en'),
  de: buildQuoteDataset('de'),
}

export const MAX_QUOTES_PER_REQUEST = 10
export const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://ataturk-kronolojisi.org'

function buildQuoteDataset(language: Language): QuoteRecord[] {
  const dataset = datasets[language] ?? datasets.tr

  return dataset.flatMap((event) => {
    const quotes = event.quotes || []
    return quotes.map((quote, index) => ({
      id: `${event.id}-${index}`,
      eventId: event.id,
      date: event.date,
      title: event.title,
      description: event.description,
      quote: quote.text,
      source: quote.source,
      language,
      eventCategory: event.category,
      image: event.images?.[0] ?? null,
    }))
  })
}

export const getQuotes = (language: Language): QuoteRecord[] => {
  return quoteCache[language] || quoteCache.tr
}

const clampCount = (count?: number | null) => {
  if (!count || Number.isNaN(count)) return 1
  return Math.min(MAX_QUOTES_PER_REQUEST, Math.max(1, count))
}

const pickRandomSubset = (source: QuoteRecord[], count: number) => {
  if (!source.length) return []
  const copy = [...source]
  const output: QuoteRecord[] = []
  for (let i = 0; i < count; i += 1) {
    if (!copy.length) break
    const randomIndex = Math.floor(Math.random() * copy.length)
    output.push(copy[randomIndex])
    copy.splice(randomIndex, 1)
  }
  return output
}

export const resolveQuotes = (language: Language, query: QuoteQuery = {}) => {
  const dataset = getQuotes(language)
  const { quoteId, eventId, date, random } = query

  let filtered = dataset

  if (quoteId) {
    filtered = dataset.filter((quote) => quote.id === quoteId)
  } else if (eventId) {
    filtered = dataset.filter((quote) => quote.eventId === eventId)
  } else if (date) {
    filtered = dataset.filter((quote) => quote.date.startsWith(date))
  }

  if (!filtered.length) {
    filtered = dataset
  }

  const count = clampCount(query.count)

  if (random) {
    return pickRandomSubset(filtered, count)
  }

  return filtered.slice(0, count)
}

export const buildPermalink = (eventId: number, language: Language, baseUrl = DEFAULT_BASE_URL) => {
  const url = new URL(baseUrl)
  url.pathname = '/'
  url.searchParams.set('id', eventId.toString())
  url.searchParams.set('language', language)
  return url.toString()
}

export type PublicQuote = {
  id: string
  text: string
  source?: string
  eventId: number
  eventTitle: string
  eventDescription?: string
  date: string
  category?: string
  image?: RawEventImage | null
  permalink: string
}

export const mapToPublicQuote = (
  quote: QuoteRecord,
  language: Language,
  baseUrl = DEFAULT_BASE_URL
): PublicQuote => ({
  id: quote.id,
  text: quote.quote,
  source: quote.source,
  eventId: quote.eventId,
  eventTitle: quote.title,
  eventDescription: quote.description,
  date: quote.date,
  category: quote.eventCategory,
  image: quote.image ?? null,
  permalink: buildPermalink(quote.eventId, language, baseUrl),
})
