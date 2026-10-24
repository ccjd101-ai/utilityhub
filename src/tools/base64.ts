function bytesToBinaryString(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return binary
}

export function encodeBase64(text: string): string {
  return btoa(bytesToBinaryString(new TextEncoder().encode(text)))
}

export function decodeBase64(encoded: string): string {
  const compact = encoded.replace(/\s+/g, '')
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(compact)) {
    throw new Error('Enter valid Base64 text.')
  }

  try {
    const binary = atob(compact)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('Base64 must decode to valid UTF-8 text.')
  }
}
