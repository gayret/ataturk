import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const JSON_DIR = path.join(process.cwd(), 'app/json')
const LANGUAGES = ['tr', 'en', 'de', 'es']

describe('Derlenmiş JSON dosyaları', () => {
  for (const lang of LANGUAGES) {
    describe(`events_${lang}.json`, () => {
      const filePath = path.join(JSON_DIR, `events_${lang}.json`)

      it('dosya mevcut olmalı', () => {
        expect(fs.existsSync(filePath), `events_${lang}.json bulunamadı — "npm run build" çalıştırıldı mı?`).toBe(true)
      })

      it('geçerli JSON array olmalı', () => {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        expect(Array.isArray(content)).toBe(true)
        expect(content.length).toBeGreaterThan(0)
      })

      it('markdown kaynak dosya sayısıyla eşleşmeli', () => {
        const mdDir = path.join(process.cwd(), 'data/events', lang)
        const mdCount = fs.readdirSync(mdDir).filter((f) => f.endsWith('.md')).length
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        expect(jsonContent.length).toBe(mdCount)
      })

      it('her event objesinde id ve title olmalı', () => {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const invalid = content.filter((e: { id?: number; title?: string }) => e.id === undefined || e.id === null)
        expect(invalid.length, `${invalid.length} event'te id eksik`).toBe(0)
      })
    })
  }
})
