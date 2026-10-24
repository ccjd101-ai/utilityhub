import { describe, expect, it } from 'vitest'
import { decodeJwt } from './jwt'

describe('decodeJwt', () => {
  it('decodes a JWT header and payload without validating the signature', () => {
    expect(decodeJwt('eyJhbGciOiJub25lIn0.eyJzdWIiOiJqb3MifQ.sig')).toEqual({
      header: { alg: 'none' },
      payload: { sub: 'jos' },
      signature: 'sig',
    })
  })

  it('supports Base64URL segments without padding and Unicode claims', () => {
    const token = 'eyJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSm9zw6kifQ.'
    expect(decodeJwt(token).payload).toEqual({ name: 'José' })
  })

  it('rejects the wrong segment count and malformed JSON', () => {
    expect(() => decodeJwt('one.two')).toThrow('three dot-separated')
    expect(() => decodeJwt('e30.bm90LWpzb24.sig')).toThrow('payload segment')
    expect(() => decodeJwt('e30.NA.sig')).toThrow('payload segment')
  })
})
