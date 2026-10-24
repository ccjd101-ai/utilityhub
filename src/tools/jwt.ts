export interface DecodedJwt {
  header: unknown
  payload: unknown
  signature: string
}

function decodeSegment(segment: string, label: string): unknown {
  if (!segment || !/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new Error(`The JWT ${label} segment is empty or malformed.`)
  }

  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const parsed: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    )
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('JWT sections must contain JSON objects.')
    }
    return parsed
  } catch {
    throw new Error(`The JWT ${label} segment is not valid Base64URL-encoded JSON.`)
  }
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('A JWT must contain three dot-separated segments.')
  }

  return {
    header: decodeSegment(parts[0], 'header'),
    payload: decodeSegment(parts[1], 'payload'),
    signature: parts[2],
  }
}
