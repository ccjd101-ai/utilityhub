export type TextCase =
  | 'unchanged'
  | 'uppercase'
  | 'lowercase'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'constant'
  | 'kebab'
  | 'screaming-kebab'
  | 'train'
  | 'dot'

export interface TextFormatOptions {
  casing: TextCase
  trimWhitespace: boolean
  collapseSpaces: boolean
}

function words(source: string): string[] {
  const separated = source
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')

  return separated.match(/[\p{L}\p{N}]+/gu) ?? []
}

function titleWord(word: string): string {
  const lower = word.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function titleCase(source: string): string {
  return source.toLowerCase().replace(
    /(^|[^\p{L}\p{N}])([\p{L}\p{N}])/gu,
    (_match, separator: string, first: string) =>
      separator + first.toUpperCase(),
  )
}

function sentenceCase(source: string): string {
  return source
    .toLowerCase()
    .replace(
      /(^\s*|[.!?]["'”’)]*\s+)([\p{L}\p{N}])/gu,
      (_match, separator: string, first: string) =>
        separator + first.toUpperCase(),
    )
}

function convertCase(source: string, casing: TextCase): string {
  if (casing === 'unchanged') return source
  if (casing === 'uppercase') return source.toUpperCase()
  if (casing === 'lowercase') return source.toLowerCase()
  if (casing === 'title') return titleCase(source)
  if (casing === 'sentence') return sentenceCase(source)

  const parts = words(source).map((word) => word.toLowerCase())
  if (casing === 'camel') {
    return parts.map((word, index) => index === 0 ? word : titleWord(word)).join('')
  }
  if (casing === 'pascal') return parts.map(titleWord).join('')
  if (casing === 'snake') return parts.join('_')
  if (casing === 'constant') return parts.join('_').toUpperCase()
  if (casing === 'kebab') return parts.join('-')
  if (casing === 'screaming-kebab') return parts.join('-').toUpperCase()
  if (casing === 'train') return parts.map(titleWord).join('-')
  return parts.join('.')
}

export function formatText(source: string, options: TextFormatOptions): string {
  let result = source

  if (options.trimWhitespace) {
    result = result.trim()
  }

  if (options.collapseSpaces) {
    result = result.replace(/ {2,}/g, ' ')
  }

  return convertCase(result, options.casing)
}
