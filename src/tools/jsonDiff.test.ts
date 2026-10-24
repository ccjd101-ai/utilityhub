import { describe, expect, it } from 'vitest'
import { diffJson, type JsonValue } from './jsonDiff'

describe('diffJson', () => {
  it('ignores object key order and reports nested value changes', () => {
    const left: JsonValue = { stable: 1, nested: { value: 'old' } }
    const right: JsonValue = { nested: { value: 'new' }, stable: 1 }

    expect(diffJson(left, right)).toEqual([
      { kind: 'changed', path: '$.nested.value', before: 'old', after: 'new' },
    ])
  })

  it('reports added and removed properties, including null values', () => {
    expect(diffJson({ gone: true, same: null }, { same: null, added: null })).toEqual([
      { kind: 'removed', path: '$.gone', before: true },
      { kind: 'added', path: '$.added', after: null },
    ])
  })

  it('compares arrays by index and reports length changes', () => {
    expect(diffJson([1, { x: 2 }, 3], [1, { x: 4 }])).toEqual([
      { kind: 'changed', path: '$[1].x', before: 2, after: 4 },
      { kind: 'removed', path: '$[2]', before: 3 },
    ])
  })

  it('formats unusual property names unambiguously in paths', () => {
    expect(diffJson({ 'first name': 'A' }, { 'first name': 'B' })[0].path)
      .toBe('$["first name"]')
  })

  it('returns no differences for equivalent nested structures', () => {
    expect(diffJson({ list: [1, null] }, { list: [1, null] })).toEqual([])
  })
})
