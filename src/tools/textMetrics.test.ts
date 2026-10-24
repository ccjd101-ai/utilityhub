import { describe, expect, it } from 'vitest'
import { countTextMetrics } from './textMetrics'

describe('countTextMetrics', () => {
  it('counts words, grapheme characters, whitespace-free characters, and lines', () => {
    expect(countTextMetrics('Hello, 🌍!\nTwo words.')).toEqual({
      characters: 20,
      charactersWithoutWhitespace: 17,
      words: 3,
      lines: 2,
    })
  })

  it('counts combined emoji as one visible character', () => {
    expect(countTextMetrics('👩‍💻').characters).toBe(1)
  })

  it('handles empty input and trailing newlines', () => {
    expect(countTextMetrics('')).toEqual({
      characters: 0,
      charactersWithoutWhitespace: 0,
      words: 0,
      lines: 0,
    })
    expect(countTextMetrics('one\n').lines).toBe(2)
  })
})
