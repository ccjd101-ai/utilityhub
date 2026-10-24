import { describe, expect, it } from 'vitest'
import {
  calculateDateDifference,
  convertTimestamp,
  formatDateTime,
  localTimeInZoneToDate,
} from './dateTime'

describe('convertTimestamp', () => {
  it('converts seconds and milliseconds to ISO dates', () => {
    expect(convertTimestamp('0').iso).toBe('1970-01-01T00:00:00.000Z')
    expect(convertTimestamp('1000', 'milliseconds').detectedUnit).toBe('milliseconds')
  })

  it('detects timestamp units and rejects invalid or out-of-range input', () => {
    expect(convertTimestamp('1700000000000').detectedUnit).toBe('milliseconds')
    expect(convertTimestamp('1700000000').detectedUnit).toBe('seconds')
    expect(() => convertTimestamp('nope')).toThrow('valid numeric')
    expect(() => convertTimestamp('1e100')).toThrow('supported date range')
  })
})

describe('localTimeInZoneToDate', () => {
  it('converts a wall-clock time between zones correctly', () => {
    expect(localTimeInZoneToDate('2024-01-15T12:00', 'America/New_York').toISOString())
      .toBe('2024-01-15T17:00:00.000Z')
  })

  it('rejects nonexistent local times during a daylight-saving transition', () => {
    expect(() => localTimeInZoneToDate('2024-03-10T02:30', 'America/New_York'))
      .toThrow('does not exist')
  })

  it('rejects invalid time-zone identifiers', () => {
    expect(() => localTimeInZoneToDate('2024-01-01T12:00', 'Not/AZone')).toThrow()
  })
})

describe('date and time formats', () => {
  it('formats ISO, UTC, date, time, and local-zone output', () => {
    const date = new Date('2024-01-01T12:00:00.000Z')
    expect(formatDateTime(date, 'UTC', 'iso')).toBe('2024-01-01T12:00:00.000Z')
    expect(formatDateTime(date, 'UTC', 'utc')).toContain('GMT')
    expect(formatDateTime(date, 'UTC', 'date')).toContain('2024')
    expect(formatDateTime(date, 'UTC', 'time')).toContain('12:00')
    expect(formatDateTime(date, 'UTC', 'local')).toContain('2024')
  })

  it('calculates signed elapsed date differences', () => {
    expect(calculateDateDifference('2024-01-01T00:00', '2024-01-02T01:02:03'))
      .toMatchObject({ days: 1, hours: 1, minutes: 2, seconds: 3, direction: 'after' })
    expect(calculateDateDifference('2024-01-02T00:00', '2024-01-01T00:00').direction).toBe('before')
  })
})
