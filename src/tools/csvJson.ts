import Papa from 'papaparse'

type CsvCell = string | number | boolean | null
type CsvRecord = Record<string, CsvCell>

export function csvToJson(csv: string): string {
  if (!csv.trim()) throw new Error('Enter CSV data to convert.')

  const result = Papa.parse<CsvRecord>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
  })

  if (result.errors.length > 0) {
    const firstError = result.errors[0]
    const row = firstError.row === undefined ? '' : ` on row ${firstError.row + 1}`
    throw new Error(`${firstError.message}${row}`)
  }

  return JSON.stringify(result.data, null, 2)
}

export function jsonToCsv(json: string): string {
  if (!json.trim()) throw new Error('Enter a JSON array to convert.')

  let parsed: unknown
  try {
    parsed = JSON.parse(json) as unknown
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON input.', {
      cause: error,
    })
  }

  if (!Array.isArray(parsed)) {
    throw new Error('JSON input must be an array of objects.')
  }
  if (parsed.length === 0) return ''

  if (
    parsed.some(
      (row) =>
        typeof row !== 'object' ||
        row === null ||
        Array.isArray(row) ||
        Object.values(row).some(
          (value) => typeof value === 'object' && value !== null,
        ),
    )
  ) {
    throw new Error('Each CSV row must be an object with scalar values only.')
  }

  return Papa.unparse(parsed as CsvRecord[], { newline: '\n' })
}
