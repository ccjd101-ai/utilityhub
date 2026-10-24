import { describe, expect, it } from 'vitest'
import { getRelatedTools, tools } from './registry'

describe('related tool catalog', () => {
  it('provides up to five explicit relations for every catalog tool', () => {
    for (const tool of tools) {
      const related = getRelatedTools(tool.href)
      expect(related.length, tool.title).toBeGreaterThan(0)
      expect(related.length, tool.title).toBeLessThanOrEqual(5)
      expect(related.some((item) => item.href === tool.href), tool.title).toBe(false)
      expect(new Set(related.map((item) => item.href)).size, tool.title).toBe(related.length)
    }
  })

  it('respects a smaller result limit and safely handles unknown paths', () => {
    expect(getRelatedTools('/tools/json-formatter', 2)).toHaveLength(2)
    expect(getRelatedTools('/tools/json-formatter', 0)).toEqual([])
    expect(getRelatedTools('/tools/missing')).toEqual([])
  })
})
