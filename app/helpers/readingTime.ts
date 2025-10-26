export interface EventImage {
  url: string
  alt: string
  source: string
}

export interface EventContent {
  title: string
  description?: string | null
  quote?: string | null
  images?: EventImage[]
}

export function calculateReadingTime(event: EventContent): number {
  const WORDS_PER_MINUTE = 200
  const MIN_DURATION = 5

  let totalText = event.title || ''

  if (event.description) {
    totalText += ' ' + event.description
  }

  if (event.quote) {
    totalText += ' ' + event.quote
  }

  if (event.images && event.images.length > 0) {
    event.images.forEach(image => {
      if (image.alt) {
        totalText += ' ' + image.alt
      }
    })
  }

  const wordCount = totalText.trim().split(/\s+/).filter(word => word.length > 0).length

  const readingTimeSeconds = Math.ceil((wordCount / WORDS_PER_MINUTE) * 60)

  return Math.max(MIN_DURATION, readingTimeSeconds)
}