import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const LANGUAGES = ['tr', 'en', 'de', 'es'] as const
const DATA_DIR = path.join(process.cwd(), 'data/events')
const REQUIRED_FIELDS = ['id', 'title', 'date', 'category', 'location']
const VALID_CATEGORIES = ['personal', 'military', 'political', 'education', 'diplomatic', 'reform', 'visit', 'other']

function loadEvents(lang: string) {
  const dir = path.join(DATA_DIR, lang)
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  return files.map((file) => {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data, content: body } = matter(content)
    return { file, data, body }
  })
}

describe('Veri bütünlüğü — Markdown dosyaları', () => {
  for (const lang of LANGUAGES) {
    describe(`[${lang}] dili`, () => {
      const events = loadEvents(lang)

      it('en az 270 olay dosyası olmalı', () => {
        expect(events.length).toBeGreaterThanOrEqual(270)
      })

      it('her olayda zorunlu alanlar bulunmalı', () => {
        const missing: string[] = []
        for (const { file, data } of events) {
          for (const field of REQUIRED_FIELDS) {
            if (data[field] === undefined || data[field] === null) {
              missing.push(`${file}: "${field}" eksik`)
            }
          }
        }
        expect(missing, missing.join('\n')).toEqual([])
      })

      it('tüm id değerleri sayısal ve benzersiz olmalı', () => {
        const ids = events.map((e) => e.data.id)
        const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
        expect(duplicates, `Tekrar eden id'ler: ${duplicates}`).toEqual([])
        for (const { file, data } of events) {
          expect(typeof data.id, `${file}: id sayısal değil`).toBe('number')
        }
      })

      it('tarih formatı geçerli ISO olmalı', () => {
        const invalid: string[] = []
        for (const { file, data } of events) {
          const d = new Date(data.date)
          if (isNaN(d.getTime())) {
            invalid.push(`${file}: "${data.date}" geçersiz tarih`)
          }
        }
        expect(invalid, invalid.join('\n')).toEqual([])
      })

      it('tarihler kronolojik sırada olmalı (1881–1938)', () => {
        const outOfRange: string[] = []
        for (const { file, data } of events) {
          const year = new Date(data.date).getFullYear()
          if (year < 1881 || year > 1938) {
            outOfRange.push(`${file}: yıl ${year} aralık dışı`)
          }
        }
        expect(outOfRange, outOfRange.join('\n')).toEqual([])
      })

      it('location.lat ve location.lon sayısal olmalı', () => {
        const invalid: string[] = []
        for (const { file, data } of events) {
          if (!data.location) continue
          if (typeof data.location.lat !== 'number') {
            invalid.push(`${file}: lat sayısal değil`)
          }
          if (typeof data.location.lon !== 'number') {
            invalid.push(`${file}: lon sayısal değil`)
          }
        }
        expect(invalid, invalid.join('\n')).toEqual([])
      })

      it('koordinatlar makul coğrafi aralıkta olmalı', () => {
        const invalid: string[] = []
        for (const { file, data } of events) {
          if (!data.location) continue
          const { lat, lon } = data.location
          if (lat < -90 || lat > 90) invalid.push(`${file}: lat ${lat} geçersiz`)
          if (lon < -180 || lon > 180) invalid.push(`${file}: lon ${lon} geçersiz`)
        }
        expect(invalid, invalid.join('\n')).toEqual([])
      })

      it('kategori değerleri tanımlı set içinde olmalı', () => {
        const invalid: string[] = []
        for (const { file, data } of events) {
          if (data.category && !VALID_CATEGORIES.includes(data.category)) {
            invalid.push(`${file}: "${data.category}" bilinmeyen kategori`)
          }
        }
        expect(invalid, invalid.join('\n')).toEqual([])
      })

      it('görsel referansları varsa url ve alt alanlarını içermeli', () => {
        const invalid: string[] = []
        for (const { file, data } of events) {
          if (!data.images || !Array.isArray(data.images)) continue
          for (const img of data.images) {
            if (!img.url) invalid.push(`${file}: görsel url eksik`)
            if (!img.alt) invalid.push(`${file}: görsel alt text eksik`)
          }
        }
        expect(invalid, invalid.join('\n')).toEqual([])
      })
    })
  }
})

describe('Diller arası tutarlılık', () => {
  const allEvents = Object.fromEntries(
    LANGUAGES.map((lang) => [lang, loadEvents(lang)])
  )

  it('tüm dillerde aynı sayıda olay olmalı', () => {
    const counts = LANGUAGES.map((lang) => allEvents[lang].length)
    expect(new Set(counts).size, `Olay sayıları: ${LANGUAGES.map((l, i) => `${l}=${counts[i]}`).join(', ')}`).toBe(1)
  })

  it('tüm dillerde aynı id seti olmalı', () => {
    const trIds = new Set(allEvents.tr.map((e) => e.data.id))
    for (const lang of ['en', 'de', 'es'] as const) {
      const langIds = new Set(allEvents[lang].map((e) => e.data.id))
      const missingInLang = [...trIds].filter((id) => !langIds.has(id))
      const extraInLang = [...langIds].filter((id) => !trIds.has(id))
      expect(missingInLang, `${lang}'de eksik id'ler: ${missingInLang}`).toEqual([])
      expect(extraInLang, `${lang}'de fazla id'ler: ${extraInLang}`).toEqual([])
    }
  })

  it('tüm dillerde aynı tarihler olmalı', () => {
    const trDates = new Map(allEvents.tr.map((e) => [e.data.id, e.data.date]))
    const mismatches: string[] = []
    for (const lang of ['en', 'de', 'es'] as const) {
      for (const event of allEvents[lang]) {
        const trDate = trDates.get(event.data.id)
        if (trDate && trDate !== event.data.date) {
          mismatches.push(`id=${event.data.id}: tr="${trDate}" vs ${lang}="${event.data.date}"`)
        }
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('tüm dillerde aynı koordinatlar olmalı', () => {
    const trLocs = new Map(
      allEvents.tr.map((e) => [e.data.id, e.data.location])
    )
    const mismatches: string[] = []
    for (const lang of ['en', 'de', 'es'] as const) {
      for (const event of allEvents[lang]) {
        const trLoc = trLocs.get(event.data.id)
        if (!trLoc || !event.data.location) continue
        if (trLoc.lat !== event.data.location.lat || trLoc.lon !== event.data.location.lon) {
          mismatches.push(`id=${event.data.id}: koordinat uyuşmazlığı (${lang})`)
        }
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })
})
