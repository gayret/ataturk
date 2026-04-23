import { describe, it, expect } from 'vitest'
import { GET, OPTIONS } from '../app/api/quotes/route'
import { NextRequest } from 'next/server'
import { MAX_QUOTES_PER_REQUEST, getQuotes } from '../app/helpers/quotes'

const BASE_URL = 'https://ataturk-kronolojisi.org'

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL(`${BASE_URL}/api/quotes`)
  // Provide a known-good baseUrl so permalink generation works in test env
  url.searchParams.set('baseUrl', BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString())
}

describe('/api/quotes', () => {
  describe('OPTIONS — CORS preflight', () => {
    it('204 döndürmeli', async () => {
      const res = await OPTIONS()
      expect(res.status).toBe(204)
    })

    it('CORS başlıkları bulunmalı', async () => {
      const res = await OPTIONS()
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET')
    })
  })

  describe('GET — temel yanıt', () => {
    it('200 döndürmeli', async () => {
      const res = await GET(makeRequest())
      expect(res.status).toBe(200)
    })

    it('quotes ve meta alanlarını içermeli', async () => {
      const res = await GET(makeRequest())
      const body = await res.json()
      expect(body).toHaveProperty('quotes')
      expect(body).toHaveProperty('meta')
      expect(Array.isArray(body.quotes)).toBe(true)
    })

    it('Cache-Control başlığı mevcut olmalı', async () => {
      const res = await GET(makeRequest())
      const cacheHeader = res.headers.get('Cache-Control')
      expect(cacheHeader).toBeTruthy()
      expect(cacheHeader).toContain('max-age=3600')
    })

    it('CORS başlıkları GET yanıtında da bulunmalı', async () => {
      const res = await GET(makeRequest())
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
    })
  })

  describe('GET — varsayılan davranış', () => {
    it('varsayılan olarak Türkçe döndürmeli', async () => {
      const res = await GET(makeRequest())
      const { meta } = await res.json()
      expect(meta.language).toBe('tr')
    })

    it('varsayılan olarak 1 quote döndürmeli', async () => {
      const res = await GET(makeRequest())
      const { quotes, meta } = await res.json()
      expect(quotes.length).toBe(1)
      expect(meta.returned).toBe(1)
    })

    it('maxPerRequest meta alanı doğru olmalı', async () => {
      const res = await GET(makeRequest())
      const { meta } = await res.json()
      expect(meta.maxPerRequest).toBe(MAX_QUOTES_PER_REQUEST)
    })
  })

  describe('GET — dil parametresi', () => {
    it('language=en kabul edilmeli', async () => {
      const res = await GET(makeRequest({ language: 'en' }))
      const { meta } = await res.json()
      expect(meta.language).toBe('en')
    })

    it('bilinmeyen dil için Türkçeye fallback yapmalı', async () => {
      const res = await GET(makeRequest({ language: 'jp' }))
      const { meta } = await res.json()
      expect(meta.language).toBe('tr')
    })
  })

  describe('GET — count parametresi', () => {
    it('count=3 ile 3 quote döndürmeli', async () => {
      const res = await GET(makeRequest({ count: '3', random: 'false' }))
      const { quotes } = await res.json()
      expect(quotes.length).toBe(3)
    })

    it(`count üst sınırı (${MAX_QUOTES_PER_REQUEST}) aşıldığında kırpılmalı`, async () => {
      const res = await GET(
        makeRequest({ count: String(MAX_QUOTES_PER_REQUEST + 5), random: 'false' }),
      )
      const { quotes } = await res.json()
      expect(quotes.length).toBeLessThanOrEqual(MAX_QUOTES_PER_REQUEST)
    })

    it('count=0 için minimum 1 quote döndürmeli', async () => {
      const res = await GET(makeRequest({ count: '0', random: 'false' }))
      const { quotes } = await res.json()
      expect(quotes.length).toBeGreaterThanOrEqual(1)
    })

    it('count geçersiz metin ise minimum 1 quote döndürmeli', async () => {
      const res = await GET(makeRequest({ count: 'abc', random: 'false' }))
      const { quotes } = await res.json()
      expect(quotes.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('GET — random parametresi', () => {
    it('random=false ile deterministik sonuç döndürmeli', async () => {
      const res1 = await GET(makeRequest({ random: 'false', count: '3' }))
      const res2 = await GET(makeRequest({ random: 'false', count: '3' }))
      const q1 = (await res1.json()).quotes.map((q: { id: string }) => q.id)
      const q2 = (await res2.json()).quotes.map((q: { id: string }) => q.id)
      expect(q1).toEqual(q2)
    })
  })

  describe('GET — quote alanları', () => {
    it('her quote zorunlu alanları içermeli', async () => {
      const res = await GET(makeRequest({ count: '5', random: 'false' }))
      const { quotes } = await res.json()
      for (const q of quotes) {
        expect(q).toHaveProperty('id')
        expect(q).toHaveProperty('text')
        expect(q).toHaveProperty('eventId')
        expect(q).toHaveProperty('eventTitle')
        expect(q).toHaveProperty('date')
        expect(q).toHaveProperty('permalink')
      }
    })

    it('permalink geçerli URL formatında olmalı', async () => {
      const res = await GET(makeRequest({ random: 'false' }))
      const { quotes } = await res.json()
      const permalink = quotes[0]?.permalink
      expect(() => new URL(permalink)).not.toThrow()
      expect(permalink).toContain('id=')
      expect(permalink).toContain('language=')
    })
  })

  describe('GET — eventId filtresi', () => {
    it("eventId ile o olayın quote'ları gelmeli", async () => {
      // Dataset'ten gerçek bir eventId al
      const targetEventId = getQuotes('tr')[0].eventId
      const res = await GET(
        makeRequest({ eventId: String(targetEventId), random: 'false', count: '10' }),
      )
      const { quotes } = await res.json()
      expect(quotes.length).toBeGreaterThan(0)
      for (const q of quotes) {
        expect(q.eventId).toBe(targetEventId)
      }
    })
  })

  describe('GET — baseUrl parametresi', () => {
    it('özel baseUrl permalink içinde kullanılmalı', async () => {
      const res = await GET(makeRequest({ baseUrl: 'https://example.com', random: 'false' }))
      const { quotes } = await res.json()
      expect(quotes[0].permalink).toContain('example.com')
    })
  })
})
