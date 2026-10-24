import { describe, expect, it } from 'vitest'
import { csvToJson, jsonToCsv } from './csvJson'

describe('CSV and JSON conversion', () => {
  it('parses quoted commas, escaped quotes, and multiline fields', () => {
    const csv = 'name,note\nA,"said ""hello"", then left"\nB,"two\nlines"'
    expect(JSON.parse(csvToJson(csv))).toEqual([
      { name: 'A', note: 'said "hello", then left' },
      { name: 'B', note: 'two\nlines' },
    ])
  })

  it('quotes JSON values that require CSV escaping', () => {
    expect(jsonToCsv('[{"name":"A, B","note":"say \\"hi\\""}]'))
      .toContain('"A, B"')
  })

  it('rejects invalid CSV and non-array or nested JSON values', () => {
    expect(() => csvToJson('a,b\n"unterminated,2')).toThrow()
    expect(() => jsonToCsv('{"name":"A"}')).toThrow('array of objects')
    expect(() => jsonToCsv('[{"nested":{"x":1}}]')).toThrow('scalar values')
  })

  it('handles empty arrays and empty input explicitly', () => {
    expect(jsonToCsv('[]')).toBe('')
    expect(() => csvToJson(' ')).toThrow('Enter CSV data')
  })
})
