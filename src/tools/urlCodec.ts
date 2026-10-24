export type UrlEncodingMode = 'url' | 'component'

export function encodeUrl(value: string, mode: UrlEncodingMode): string {
  return mode === 'url' ? encodeURI(value) : encodeURIComponent(value)
}

export function decodeUrl(value: string, mode: UrlEncodingMode): string {
  try {
    return mode === 'url' ? decodeURI(value) : decodeURIComponent(value)
  } catch {
    throw new Error('The input contains an invalid or incomplete percent escape.')
  }
}
