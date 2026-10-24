import { describe, expect, it } from 'vitest'
import { formatBytes, outputFileName, resizedDimensions } from './imageProcessing'

describe('image processing helpers', () => {
  it('resizes proportionally and does not upscale', () => {
    expect(resizedDimensions(4000, 2000, 1000)).toEqual({ width: 1000, height: 500 })
    expect(resizedDimensions(400, 200, 1000)).toEqual({ width: 400, height: 200 })
    expect(resizedDimensions(3, 2, 1)).toEqual({ width: 1, height: 1 })
  })

  it('rejects invalid dimensions', () => {
    expect(() => resizedDimensions(0, 100, 50)).toThrow()
    expect(() => resizedDimensions(100, 100, Number.NaN)).toThrow()
  })

  it('formats sizes and preserves the selected output extension', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(outputFileName('photo.jpeg', 'image/webp')).toBe('photo-optimized.webp')
  })
})
