export type TimestampUnit = 'seconds' | 'milliseconds'

export interface TimestampResult {
  milliseconds: number
  detectedUnit: TimestampUnit
  iso: string
}

export function convertTimestamp(input: string, unit: TimestampUnit | 'auto' = 'auto'): TimestampResult {
  const value = Number(input.trim())
  if (!input.trim() || !Number.isFinite(value)) throw new Error('Enter a valid numeric Unix timestamp.')

  const detectedUnit = unit === 'auto'
    ? (Math.abs(value) >= 100_000_000_000 ? 'milliseconds' : 'seconds')
    : unit
  const milliseconds = detectedUnit === 'seconds' ? value * 1000 : value
  const date = new Date(milliseconds)
  if (!Number.isFinite(date.getTime())) throw new Error('Timestamp is outside the supported date range.')

  return { milliseconds, detectedUnit, iso: date.toISOString() }
}

function parseLocalParts(value: string): [number, number, number, number, number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value)
  if (!match) throw new Error('Enter a valid local date and time.')
  const [, year, month, day, hour, minute, second = '0', fraction = '0'] = match
  const parts: [number, number, number, number, number, number, number] = [
    Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second),
    Number(fraction.padEnd(3, '0')),
  ]
  const check = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]))
  if (check.getUTCFullYear() !== parts[0] || check.getUTCMonth() + 1 !== parts[1]
    || check.getUTCDate() !== parts[2] || parts[3] > 23 || parts[4] > 59 || parts[5] > 59) {
    throw new Error('Enter a valid local date and time.')
  }
  return parts
}

function zonedParts(epoch: number, timeZone: string): number[] {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(epoch))
  const values = Object.fromEntries(formatted.map(({ type, value }) => [type, value]))
  return [Number(values.year), Number(values.month), Number(values.day), Number(values.hour), Number(values.minute), Number(values.second)]
}

export function localTimeInZoneToDate(value: string, timeZone: string): Date {
  const local = parseLocalParts(value)
  // Validate the IANA zone before doing offset resolution.
  new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date(0))
  const desired = Date.UTC(local[0], local[1] - 1, local[2], local[3], local[4], local[5], local[6])
  let epoch = desired

  // Iterate the zone offset until the candidate instant formats back to the requested wall time.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const shown = zonedParts(epoch, timeZone)
    const shownAsUtc = Date.UTC(shown[0], shown[1] - 1, shown[2], shown[3], shown[4], shown[5])
    const next = epoch + desired - shownAsUtc
    if (next === epoch) break
    epoch = next
  }

  const result = new Date(epoch)
  const actual = zonedParts(result.getTime(), timeZone)
  if (actual.some((part, index) => part !== local[index])) {
    throw new Error('That local time does not exist in this time zone because of a daylight-saving clock change.')
  }
  return result
}

export function formatDateTime(date: Date, timeZone: string, format: 'iso' | 'utc' | 'local' | 'date' | 'time'): string {
  if (!Number.isFinite(date.getTime())) throw new Error('Enter a valid date and time.')
  if (format === 'iso') return date.toISOString()
  if (format === 'utc') return date.toUTCString()

  const options: Intl.DateTimeFormatOptions = format === 'date'
    ? { dateStyle: 'full' }
    : format === 'time'
      ? { timeStyle: 'long' }
      : { dateStyle: 'full', timeStyle: 'long' }
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone }).format(date)
}

export function calculateDateDifference(startValue: string, endValue: string): {
  milliseconds: number
  days: number
  hours: number
  minutes: number
  seconds: number
  direction: 'before' | 'after' | 'same'
} {
  const parse = (value: string) => {
    if (!value) throw new Error('Choose both dates and times.')
    const date = new Date(value)
    if (!Number.isFinite(date.getTime())) throw new Error('Enter valid dates and times.')
    return date.getTime()
  }
  const difference = parse(endValue) - parse(startValue)
  let remaining = Math.abs(difference) / 1000
  const days = Math.floor(remaining / 86400)
  remaining %= 86400
  const hours = Math.floor(remaining / 3600)
  remaining %= 3600
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)
  return {
    milliseconds: difference,
    days,
    hours,
    minutes,
    seconds,
    direction: difference < 0 ? 'before' : difference > 0 ? 'after' : 'same',
  }
}
