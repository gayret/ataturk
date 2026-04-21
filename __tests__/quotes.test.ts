import { describe, it, expect } from 'vitest'
import {
  resolveQuotes,
  getQuotes,
  buildPermalink,
  mapToPublicQuote,
  MAX_QUOTES_PER_REQUEST,
  type Language,
} from '../app/helpers/quotes'

const LANGUAGES: Language[] = ['tr', 'en', 'de', 'es']

describe('Quote sistemi', () => {
  describe('getQuotes', () => {
    for (const lang of LANGUAGES) {
      it(`[${lang}] quote dataset'i boş olmamalı`, () => {
        const quotes = getQuotes(lang)
        expect(quotes.length).toBeGreaterThan(0)
      })

      it(`[${lang}] her quote'ta zorunlu alanlar olmalı`, () => {
        const quotes = getQuotes(lang)
        for (const q of quotes) {
          expect(q.id).toBeTruthy()
          expect(q.eventId).toBeTypeOf('number')
          expect(q.date).toBeTruthy()
          expect(q.quote).toBeTruthy()
          expect(q.language).toBe(lang)
        }
      })
    }

    it('bilinmeyen dil için Türkçe fallback yapmalı', () => {
      const quotes = getQuotes('xx' as Language)
      const trQuotes = getQuotes('tr')
      expect(quotes).toEqual(trQuotes)
    })
  })

  describe('resolveQuotes', () => {
    it('quoteId ile tek sonuç döndürmeli', () => {
      const allQuotes = getQuotes('tr')
      const target = allQuotes[0]
      const result = resolveQuotes('tr', { quoteId: target.id })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(target.id)
    })

    it('eventId ile o olaya ait tüm alıntıları döndürmeli', () => {
      const allQuotes = getQuotes('tr')
      const targetEventId = allQuotes[0].eventId
      const result = resolveQuotes('tr', { eventId: targetEventId })
      expect(result.length).toBeGreaterThan(0)
      expect(result.every((q) => q.eventId === targetEventId)).toBe(true)
    })

    it('date filtresi çalışmalı', () => {
      const allQuotes = getQuotes('tr')
      const targetDate = allQuotes[0].date.slice(0, 4)
      const result = resolveQuotes('tr', { date: targetDate })
      expect(result.length).toBeGreaterThan(0)
      for (const q of result) {
        expect(q.date).toContain(targetDate)
      }
    })

    it('random=true ile rastgele sonuç döndürmeli', () => {
      const result = resolveQuotes('tr', { random: true, count: 3 })
      expect(result.length).toBeLessThanOrEqual(3)
    })

    it('count MAX_QUOTES_PER_REQUEST ile sınırlı olmalı', () => {
      const result = resolveQuotes('tr', { random: true, count: 999 })
      expect(result.length).toBeLessThanOrEqual(MAX_QUOTES_PER_REQUEST)
    })

    it('eşleşme yoksa tüm datasetten döndürmeli (fallback)', () => {
      const result = resolveQuotes('tr', { quoteId: 'nonexistent-id-xyz' })
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('buildPermalink', () => {
    it('doğru URL formatı üretmeli', () => {
      const url = buildPermalink(1, 'tr', 'https://ataturk-kronolojisi.org')
      expect(url).toBe('https://ataturk-kronolojisi.org/?id=1&language=tr')
    })

    it('farklı dil için language parametresi değişmeli', () => {
      const url = buildPermalink(42, 'en', 'https://ataturk-kronolojisi.org')
      expect(url).toContain('language=en')
      expect(url).toContain('id=42')
    })
  })

  describe('mapToPublicQuote', () => {
    it('QuoteRecord → PublicQuote dönüşümü doğru olmalı', () => {
      const quotes = getQuotes('tr')
      const source = quotes[0]
      const result = mapToPublicQuote(source, 'tr', 'https://ataturk-kronolojisi.org')

      expect(result.id).toBe(source.id)
      expect(result.text).toBe(source.quote)
      expect(result.eventId).toBe(source.eventId)
      expect(result.eventTitle).toBe(source.title)
      expect(result.permalink).toContain('ataturk-kronolojisi.org')
      expect(result.permalink).toContain(`id=${source.eventId}`)
    })
  })
})
