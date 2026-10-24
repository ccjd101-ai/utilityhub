const UUID_GUID_PATTERN = /^(?:\{)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\})?$/i

export function isUuidGuidFormat(input: string): boolean {
  const value = input.trim()
  const hasOpeningBrace = value.startsWith('{')
  const hasClosingBrace = value.endsWith('}')

  if (hasOpeningBrace !== hasClosingBrace) return false
  return UUID_GUID_PATTERN.test(value)
}
