export type SlugSeparator = '-' | '_'

export function createSlug(input: string, separator: SlugSeparator = '-'): string {
  return input
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
}
