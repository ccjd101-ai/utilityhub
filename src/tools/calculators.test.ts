import { describe, expect, it } from 'vitest'
import { calculatePercentage, calculateTip, convertUnits } from './calculators'

describe('everyday calculators', () => {
  it('calculates common percentage questions and guards zero denominators', () => {
    expect(calculatePercentage('of', 15, 80)).toBe(12)
    expect(calculatePercentage('what-percent', 12, 80)).toBe(15)
    expect(calculatePercentage('change', 80, 100)).toBe(25)
    expect(calculatePercentage('change', 100, 80)).toBe(-20)
    expect(() => calculatePercentage('what-percent', 1, 0)).toThrow(/zero/)
  })

  it('converts unit families and temperature scales', () => {
    expect(convertUnits(1, 'length', 'mi', 'km')).toBeCloseTo(1.609344)
    expect(convertUnits(1000, 'weight', 'g', 'kg')).toBe(1)
    expect(convertUnits(1, 'volume', 'gal', 'l')).toBeCloseTo(3.7854, 3)
    expect(convertUnits(32, 'temperature', 'f', 'c')).toBeCloseTo(0)
    expect(convertUnits(0, 'temperature', 'c', 'k')).toBeCloseTo(273.15)
  })

  it('calculates a split tip and validates inputs', () => {
    expect(calculateTip(80, 20, 4)).toEqual({ tip: 16, total: 96, tipPerPerson: 4, totalPerPerson: 24 })
    expect(() => calculateTip(-1, 15, 2)).toThrow()
  })
})
