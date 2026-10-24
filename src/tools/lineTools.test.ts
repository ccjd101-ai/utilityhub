import { describe, expect, it } from 'vitest'
import { transformLines } from './lineTools'

describe('transformLines', () => {
  it('removes duplicate lines while keeping the first occurrence', () => {
    expect(transformLines('pear\napple\npear\n', 'unique')).toBe('pear\napple\n')
  })

  it('can compare duplicate lines without regard to case', () => {
    expect(transformLines('Alpha\nalpha\nBeta', 'unique', true))
      .toBe('Alpha\nBeta')
  })

  it('sorts lines in either direction and preserves trailing newline state', () => {
    expect(transformLines('item 10\nitem 2\nitem 1', 'sort-ascending'))
      .toBe('item 1\nitem 2\nitem 10')
    expect(transformLines('b\na\n', 'sort-descending')).toBe('b\na\n')
  })

  it('handles empty input and blank lines', () => {
    expect(transformLines('', 'unique')).toBe('')
    expect(transformLines('a\n\na', 'unique')).toBe('a\n')
  })
})
