import { describe, expect, it } from 'vitest'
import { compareText } from './plainTextDiff'

describe('compareText', () => {
  it('labels unchanged, removed, and added lines', () => {
    expect(compareText('keep\nold\n', 'keep\nnew\n')).toEqual([
      { kind: 'unchanged', value: 'keep\n' },
      { kind: 'removed', value: 'old\n' },
      { kind: 'added', value: 'new\n' },
    ])
  })

  it('handles insertion, deletion, and identical text', () => {
    expect(compareText('', 'new').map((part) => part.kind)).toEqual(['added'])
    expect(compareText('gone', '').map((part) => part.kind)).toEqual(['removed'])
    expect(compareText('same', 'same')).toEqual([{ kind: 'unchanged', value: 'same' }])
  })
})
