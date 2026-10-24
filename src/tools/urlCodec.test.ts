import { describe, expect, it } from 'vitest'
import { decodeUrl, encodeUrl } from './urlCodec'

describe('URL encoding and decoding', () => {
  it('encodes and decodes URL components', () => {
    const text = 'hello world & tea'
    expect(encodeUrl(text, 'component')).toBe('hello%20world%20%26%20tea')
    expect(decodeUrl('hello%20world%20%26%20tea', 'component')).toBe(text)
  })

  it('preserves URL separators in whole-URL mode', () => {
    const url = 'https://example.com/search?q=hello world&lang=en'
    expect(encodeUrl(url, 'url')).toBe(
      'https://example.com/search?q=hello%20world&lang=en',
    )
    expect(decodeUrl('https://example.com/a%20b?q=x%20y', 'url'))
      .toBe('https://example.com/a b?q=x y')
  })

  it('rejects malformed percent escapes', () => {
    expect(() => decodeUrl('%E0%A4%A', 'component')).toThrow('invalid or incomplete')
  })
})
