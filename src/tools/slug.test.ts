import { describe, expect, it } from 'vitest'
import { createSlug } from './slug'

describe('createSlug', () => {
  it('normalizes punctuation, spaces, and accented characters', () => {
    expect(createSlug('  Café & Tea: A Guide!  ')).toBe('cafe-tea-a-guide')
  })

  it('supports underscore separators and Unicode letters', () => {
    expect(createSlug('東京 — Utility Hub', '_')).toBe('東京_utility_hub')
  })

  it('handles empty and separator-only input', () => {
    expect(createSlug('')).toBe('')
    expect(createSlug(' --- ')).toBe('')
  })
})
