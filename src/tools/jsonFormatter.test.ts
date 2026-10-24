import { describe, expect, it } from 'vitest'
import { transformJson } from './jsonFormatter'

describe('transformJson', () => {
  it('pretty-prints JSON with the selected indentation', () => {
    expect(transformJson('{"name":"UtilityHub","active":true}', 'format', 4))
      .toBe(`{
    "name": "UtilityHub",
    "active": true
}`)
  })

  it('minifies JSON without changing its value', () => {
    expect(transformJson(' { "items" : [ 1, 2 ] } ', 'minify'))
      .toBe('{"items":[1,2]}')
  })

  it('supports JSON primitive values', () => {
    expect(transformJson('"hello"', 'format')).toBe('"hello"')
    expect(transformJson('null', 'minify')).toBe('null')
  })

  it('rejects empty input with a clear message', () => {
    expect(() => transformJson('  ', 'format')).toThrow(
      'Enter JSON to format or minify.',
    )
  })

  it('rejects malformed JSON', () => {
    expect(() => transformJson('{invalid}', 'format')).toThrow(SyntaxError)
  })
})
