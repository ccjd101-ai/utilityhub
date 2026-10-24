export type PercentageMode = 'of' | 'what-percent' | 'change'

export function calculatePercentage(mode: PercentageMode, first: number, second: number): number {
  if (![first, second].every(Number.isFinite)) throw new Error('Enter valid numbers.')
  if (mode === 'of') return first * second / 100
  if (mode === 'what-percent') {
    if (second === 0) throw new Error('The whole value cannot be zero.')
    return first / second * 100
  }
  if (first === 0) throw new Error('The starting value cannot be zero when calculating percentage change.')
  return (second - first) / Math.abs(first) * 100
}

export type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature'
export interface UnitDefinition { id: string; label: string; factor?: number; offset?: number }

export const unitDefinitions: Record<UnitCategory, UnitDefinition[]> = {
  length: [
    { id: 'm', label: 'Meters', factor: 1 }, { id: 'km', label: 'Kilometers', factor: 1000 },
    { id: 'cm', label: 'Centimeters', factor: 0.01 }, { id: 'mi', label: 'Miles', factor: 1609.344 },
    { id: 'ft', label: 'Feet', factor: 0.3048 }, { id: 'in', label: 'Inches', factor: 0.0254 },
  ],
  weight: [
    { id: 'kg', label: 'Kilograms', factor: 1 }, { id: 'g', label: 'Grams', factor: 0.001 },
    { id: 'lb', label: 'Pounds', factor: 0.45359237 }, { id: 'oz', label: 'Ounces', factor: 0.028349523125 },
  ],
  volume: [
    { id: 'l', label: 'Liters', factor: 1 }, { id: 'ml', label: 'Milliliters', factor: 0.001 },
    { id: 'gal', label: 'US gallons', factor: 3.785411784 }, { id: 'cup', label: 'US cups', factor: 0.2365882365 },
  ],
  temperature: [
    { id: 'c', label: 'Celsius' }, { id: 'f', label: 'Fahrenheit' }, { id: 'k', label: 'Kelvin' },
  ],
}

export function convertUnits(value: number, category: UnitCategory, from: string, to: string): number {
  if (!Number.isFinite(value)) throw new Error('Enter a valid number.')
  const units = unitDefinitions[category]
  const source = units.find((unit) => unit.id === from)
  const target = units.find((unit) => unit.id === to)
  if (!source || !target) throw new Error('Choose units from the selected category.')
  if (category === 'temperature') {
    const celsius = from === 'c' ? value : from === 'f' ? (value - 32) * 5 / 9 : value - 273.15
    return to === 'c' ? celsius : to === 'f' ? celsius * 9 / 5 + 32 : celsius + 273.15
  }
  return value * (source.factor ?? 1) / (target.factor ?? 1)
}

export interface TipBreakdown { tip: number; total: number; tipPerPerson: number; totalPerPerson: number }

export function calculateTip(bill: number, tipPercent: number, people: number): TipBreakdown {
  if (![bill, tipPercent, people].every(Number.isFinite) || bill < 0 || tipPercent < 0 || people < 1 || !Number.isInteger(people)) {
    throw new Error('Enter a non-negative bill and tip, and a whole number of people.')
  }
  const tip = bill * tipPercent / 100
  const total = bill + tip
  return { tip, total, tipPerPerson: tip / people, totalPerPerson: total / people }
}
