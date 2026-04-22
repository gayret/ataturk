import { describe, it, expect, beforeEach } from 'vitest'
import { calculateReadingTime } from '../app/helpers/readingTime'
import { convertDateFormat, getYear } from '../app/helpers/date'

describe('calculateReadingTime', () => {
  it('kısa başlık için minimum süre (5s) döndürmeli', () => {
    const result = calculateReadingTime({ title: 'Kısa başlık' })
    expect(result).toBe(5)
  })

  it('uzun açıklama için 5 saniyeden fazla döndürmeli', () => {
    const longText = Array(500).fill('kelime').join(' ')
    const result = calculateReadingTime({ title: 'Başlık', description: longText })
    expect(result).toBeGreaterThan(5)
  })

  it('alıntıları hesaplamaya dahil etmeli', () => {
    const withoutQuotes = calculateReadingTime({ title: 'Başlık', description: 'Açıklama' })
    const withQuotes = calculateReadingTime({
      title: 'Başlık',
      description: 'Açıklama',
      quotes: [{ text: Array(200).fill('söz').join(' ') }],
    })
    expect(withQuotes).toBeGreaterThan(withoutQuotes)
  })

  it('görsellerin alt textlerini hesaplamaya dahil etmeli', () => {
    const withoutImages = calculateReadingTime({ title: 'Başlık' })
    const withImages = calculateReadingTime({
      title: 'Başlık',
      images: [
        { url: '/img.jpg', alt: Array(200).fill('görsel').join(' '), source: 'kaynak' },
      ],
    })
    expect(withImages).toBeGreaterThan(withoutImages)
  })

  it('boş/null alanları sorunsuz işlemeli', () => {
    expect(() =>
      calculateReadingTime({ title: '', description: null, quotes: null, images: null })
    ).not.toThrow()
  })
})

describe('getYear', () => {
  it('ISO tarihten yıl çıkarmalı', () => {
    expect(getYear('1881-05-19T00:00:00Z')).toBe(1881)
  })

  it('geçersiz tarih için 0 döndürmeli', () => {
    expect(getYear('invalid')).toBe(0)
  })

  it('sadece yıl-ay formatını işlemeli', () => {
    expect(getYear('1920-04-23')).toBe(1920)
  })
})

describe('convertDateFormat', () => {
  it('"31.12.1885 23:00:00" → "1885-12-31 23:00:00" dönüştürmeli', () => {
    expect(convertDateFormat('31.12.1885 23:00:00')).toBe('1885-12-31 23:00:00')
  })

  it('tek haneli gün/ay padding yapmalı', () => {
    expect(convertDateFormat('1.2.1920 10:00:00')).toBe('1920-02-01 10:00:00')
  })
})
