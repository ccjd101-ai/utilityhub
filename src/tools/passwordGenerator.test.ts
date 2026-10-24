import { describe, expect, it } from 'vitest'
import { generatePassword, type PasswordOptions } from './passwordGenerator'

const constantByte = (value: number) => () => value
const defaults: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
}

describe('generatePassword', () => {
  it('generates requested length and includes every selected character group', () => {
    const password = generatePassword(defaults, constantByte(42))
    expect(password).toHaveLength(20)
    expect(password).toMatch(/[a-z]/)
    expect(password).toMatch(/[A-Z]/)
    expect(password).toMatch(/[0-9]/)
    expect(password).toMatch(/[^a-zA-Z0-9]/)
  })

  it('supports custom lengths and excludes ambiguous characters', () => {
    const password = generatePassword({
      ...defaults,
      length: 8,
      uppercase: false,
      symbols: true,
      excludeAmbiguous: true,
    }, constantByte(7))
    expect(password).toHaveLength(8)
    expect(password).not.toMatch(/[O0Il1|]/)
  })

  it('rejects invalid lengths or an empty character selection', () => {
    expect(() => generatePassword({ ...defaults, length: 7 })).toThrow('between 8 and 128')
    expect(() => generatePassword({ ...defaults, length: 129 })).toThrow('between 8 and 128')
    expect(() => generatePassword({ ...defaults, lowercase: false, uppercase: false, numbers: false, symbols: false }))
      .toThrow('at least one character type')
  })

  it('uses rejection sampling for unbiased character selection', () => {
    const bytes = [255, 8, 0, 0, 0, 0, 0, 0]
    let index = 0
    const password = generatePassword({
      length: 8,
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
    }, () => bytes[index++] ?? 0)
    expect(password).toHaveLength(8)
    expect(index).toBeGreaterThan(8)
  })
})
