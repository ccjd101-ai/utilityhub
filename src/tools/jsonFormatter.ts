export type JsonIndentation = 2 | 4

export function transformJson(
  source: string,
  mode: 'format' | 'minify',
  indentation: JsonIndentation = 2,
): string {
  if (!source.trim()) {
    throw new Error('Enter JSON to format or minify.')
  }

  const parsed: unknown = JSON.parse(source)
  return JSON.stringify(parsed, null, mode === 'format' ? indentation : 0)
}
