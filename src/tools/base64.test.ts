import { describe, expect, it } from 'vitest'
import { decodeBase64, encodeBase64 } from './base64'

describe('Base64 text conversion', () => {
  it('encodes and decodes ASCII text', () => {
    expect(encodeBase64('UtilityHub')).toBe('VXRpbGl0eUh1Yg==')
    expect(decodeBase64('VXRpbGl0eUh1Yg==')).toBe('UtilityHub')
  })

  it('round-trips Unicode text', () => {
    const text = 'Hello 🌍 — café'
    expect(decodeBase64(encodeBase64(text))).toBe(text)
  })

  it('allows empty input and whitespace between encoded groups', () => {
    expect(decodeBase64('')).toBe('')
    expect(decodeBase64('VXRp\nbGl0eUh1Yg==')).toBe('UtilityHub')
  })

  it('rejects invalid alphabet and invalid UTF-8 payloads', () => {
    expect(() => decodeBase64('invalid!')).toThrow('Enter valid Base64 text.')
    expect(() => decodeBase64('/w==')).toThrow('valid UTF-8')
  })
})
