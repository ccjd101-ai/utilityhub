import { describe, expect, it } from 'vitest'
import { isUuidGuidFormat } from './uuidValidator'

describe('isUuidGuidFormat', () => {
  it('accepts canonical UUID/GUID strings in either case', () => {
    expect(isUuidGuidFormat('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    expect(isUuidGuidFormat('550E8400-E29B-41D4-A716-446655440000')).toBe(true)
  })

  it('accepts outer braces and surrounding whitespace', () => {
    expect(isUuidGuidFormat('  {550e8400-e29b-41d4-a716-446655440000}  ')).toBe(true)
  })

  it('rejects malformed groups, non-hex characters, and mismatched braces', () => {
    expect(isUuidGuidFormat('550e8400-e29b-41d4-a716-44665544000')).toBe(false)
    expect(isUuidGuidFormat('550e8400-e29b-41d4-a716-44665544000z')).toBe(false)
    expect(isUuidGuidFormat('{550e8400-e29b-41d4-a716-446655440000')).toBe(false)
    expect(isUuidGuidFormat('')).toBe(false)
  })
})
