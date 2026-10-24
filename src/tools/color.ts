export interface RgbColor { r: number; g: number; b: number }

export function parseHexColor(value: string): RgbColor {
  const hex = value.trim().replace(/^#/, '')
  if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) {
    throw new Error('Enter a valid 3- or 6-digit HEX color, such as #42e6a4.')
  }
  const normalized = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

export function rgbToHsl({ r, g, b }: RgbColor): { h: number; s: number; l: number } {
  const red = r / 255, green = g / 255, blue = b / 255
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue)
  const delta = max - min
  let h = 0
  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6
    else if (max === green) h = (blue - red) / delta + 2
    else h = (red - green) / delta + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function relativeLuminance(color: RgbColor): number {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function contrastRatio(foreground: RgbColor, background: RgbColor): number {
  const first = relativeLuminance(foreground), second = relativeLuminance(background)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
