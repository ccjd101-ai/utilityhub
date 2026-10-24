export type LineOperation = 'unique' | 'sort-ascending' | 'sort-descending'

export function transformLines(
  input: string,
  operation: LineOperation,
  caseInsensitive = false,
): string {
  if (!input) return ''

  const hasTrailingNewline = /(?:\r\n|\r|\n)$/.test(input)
  let lines = input.split(/\r\n|\r|\n/)
  if (hasTrailingNewline) lines.pop()

  if (operation === 'unique') {
    const seen = new Set<string>()
    lines = lines.filter((line) => {
      const key = caseInsensitive ? line.toLocaleLowerCase() : line
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } else {
    const direction = operation === 'sort-ascending' ? 1 : -1
    lines.sort((left, right) => direction * left.localeCompare(right, undefined, {
      sensitivity: 'base',
      numeric: true,
    }))
  }

  return lines.join('\n') + (hasTrailingNewline ? '\n' : '')
}
