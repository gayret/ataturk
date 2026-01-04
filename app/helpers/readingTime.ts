import { QuoteType } from '../components/content/Content'

export interface EventImage {
  url: string
  alt: string
  source: string
}

export interface EventContent {
  title: string
  description?: string | null
  quotes?: QuoteType[] | null
  images?: EventImage[] | null
}

export interface CalculateReadingTimeOptions {
  voiceEnabled?: boolean
}

export function calculateReadingTime(
  event: EventContent,
  options?: CalculateReadingTimeOptions
): number {
  const WORDS_PER_MINUTE = 200
  const VOICE_WORDS_PER_MINUTE = 110
  const MIN_DURATION = 5
  const VOICE_MIN_DURATION = 8

  const isVoiceEnabled =
    options?.voiceEnabled ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('voice') === 'enabled')

  let totalText = event.title || ''

  if (event.description) {
    totalText += ' ' + event.description
  }

  if (event.quotes && event.quotes.length > 0) {
    event.quotes.forEach((quote: QuoteType) => {
      if (quote.text) {
        totalText += ' ' + quote.text
      }
    })
  }

  if (event.images && event.images.length > 0) {
    event.images.forEach((image) => {
      if (image.alt) {
        totalText += ' ' + image.alt
      }
    })
  }

  const wordCount = totalText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  const wordsPerMinute = isVoiceEnabled ? VOICE_WORDS_PER_MINUTE : WORDS_PER_MINUTE
  const minDuration = isVoiceEnabled ? VOICE_MIN_DURATION : MIN_DURATION

  const readingTimeSeconds = Math.ceil((wordCount / wordsPerMinute) * 60)

  return Math.max(minDuration, readingTimeSeconds)
}
