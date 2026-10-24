import { describe, expect, it } from 'vitest'
import { hasSeenIntro, markIntroSeen } from './introPersistence'

describe('homepage intro persistence', () => {
  it('records completion for future visits', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }
    expect(hasSeenIntro(storage)).toBe(false)
    markIntroSeen(storage)
    expect(hasSeenIntro(storage)).toBe(true)
  })

  it('gracefully handles unavailable storage', () => {
    const storage = {
      getItem: () => { throw new Error('unavailable') },
      setItem: () => { throw new Error('unavailable') },
    }
    expect(hasSeenIntro(storage)).toBe(false)
    expect(() => markIntroSeen(storage)).not.toThrow()
  })
})
