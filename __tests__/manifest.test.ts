import { describe, it, expect } from 'vitest'
import manifest from '../app/manifest'

describe('Web App Manifest', () => {
  const m = manifest()

  it('name ve short_name dolu olmalı', () => {
    expect(m.name).toBeTruthy()
    expect(m.short_name).toBeTruthy()
    expect(m.short_name!.length).toBeLessThanOrEqual(12)
  })

  it('start_url "/" olmalı', () => {
    expect(m.start_url).toBe('/')
  })

  it('display standalone olmalı', () => {
    expect(m.display).toBe('standalone')
  })

  it('theme_color ve background_color geçerli hex renk olmalı', () => {
    const hexPattern = /^#[0-9a-fA-F]{3,8}$/
    expect(m.theme_color).toMatch(hexPattern)
    expect(m.background_color).toMatch(hexPattern)
  })

  it('en az 2 ikon tanımlı olmalı', () => {
    expect(Array.isArray(m.icons)).toBe(true)
    expect(m.icons!.length).toBeGreaterThanOrEqual(2)
  })

  it('her ikon src, sizes ve type içermeli', () => {
    for (const icon of m.icons ?? []) {
      expect(icon.src).toBeTruthy()
      expect(icon.sizes).toBeTruthy()
      expect(icon.type).toContain('image/')
    }
  })

  it('192x192 ve 512x512 ikonlar tanımlı olmalı', () => {
    const sizes = (m.icons ?? []).map((i) => i.sizes)
    expect(sizes.some((s) => s?.includes('192'))).toBe(true)
    expect(sizes.some((s) => s?.includes('512'))).toBe(true)
  })

  it('lang alanı tanımlı olmalı', () => {
    expect(m.lang).toBeTruthy()
  })
})
