import { describe, expect, it } from 'vitest'
import { findRegexMatches } from './regexTester'

describe('findRegexMatches', () => {
  it('returns all matches and capture groups', () => {
    expect(findRegexMatches('(cat)(\\d+)', 'i', 'Cat1 cat22')).toEqual([
      { value: 'Cat1', index: 0, groups: ['Cat', '1'] },
      { value: 'cat22', index: 5, groups: ['cat', '22'] },
    ])
  })

  it('supports user-provided global and multiline flags', () => {
    expect(findRegexMatches('^item', 'gm', 'item one\nitem two').map((m) => m.value))
      .toEqual(['item', 'item'])
  })

  it('handles zero-width matches and reports invalid patterns or flags', () => {
    expect(findRegexMatches('(?=a)', '', 'aa')).toHaveLength(2)
    expect(() => findRegexMatches('[', '', 'text')).toThrow()
    expect(() => findRegexMatches('a', 'z', 'text')).toThrow()
  })

  it('limits large result sets', () => {
    expect(findRegexMatches('.', '', 'abcdef', 3)).toHaveLength(3)
  })
})
