export type ImageOutputType = 'image/jpeg' | 'image/png' | 'image/webp'

export function resizedDimensions(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (![width, height, maxEdge].every(Number.isFinite) || width <= 0 || height <= 0 || maxEdge <= 0) {
    throw new Error('Image dimensions and maximum edge must be positive numbers.')
  }
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function outputFileName(name: string, type: ImageOutputType): string {
  const base = name.replace(/\.[^.]+$/, '') || 'image'
  const extension = type === 'image/jpeg' ? 'jpg' : type === 'image/png' ? 'png' : 'webp'
  return `${base}-optimized.${extension}`
}
