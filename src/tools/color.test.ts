import { describe, expect, it } from 'vitest'
import { contrastRatio, parseHexColor, rgbToHsl } from './color'

describe('color utilities', () => {
  it('parses short and full HEX colors', () => {
    expect(parseHexColor('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(parseHexColor('42e6a4')).toEqual({ r: 66, g: 230, b: 164 })
    expect(() => parseHexColor('nope')).toThrow(/valid/)
  })

  it('converts RGB to HSL', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 })
  })

  it('calculates WCAG contrast ratios', () => {
    expect(contrastRatio(parseHexColor('#000'), parseHexColor('#fff'))).toBeCloseTo(21)
    expect(contrastRatio(parseHexColor('#fff'), parseHexColor('#fff'))).toBeCloseTo(1)
  })
})
