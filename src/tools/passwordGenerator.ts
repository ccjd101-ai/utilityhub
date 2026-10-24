export interface PasswordOptions {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous?: boolean
}

const characterGroups = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/|~',
}

function secureRandomByte(): number {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Cryptographic password generation is unavailable in this browser context. Use HTTPS or localhost.')
  }
  const bytes = new Uint8Array(1)
  globalThis.crypto.getRandomValues(bytes)
  return bytes[0]
}

function randomIndex(max: number, randomByte: () => number): number {
  const cutoff = 256 - (256 % max)
  let byte = randomByte()
  while (byte >= cutoff) byte = randomByte()
  return byte % max
}

export function generatePassword(
  options: PasswordOptions,
  randomByte = secureRandomByte,
): string {
  if (!Number.isInteger(options.length) || options.length < 8 || options.length > 128) {
    throw new Error('Choose a password length between 8 and 128 characters.')
  }

  // Build the selected groups explicitly to keep option names and character sets coupled.
  const groups = [
    options.lowercase ? characterGroups.lowercase : '',
    options.uppercase ? characterGroups.uppercase : '',
    options.numbers ? characterGroups.numbers : '',
    options.symbols ? characterGroups.symbols : '',
  ].filter(Boolean).map((group) => options.excludeAmbiguous
    ? group.replace(/[O0Il1|]/g, '')
    : group)
    .filter(Boolean)

  if (groups.length === 0) throw new Error('Select at least one character type.')
  if (options.length < groups.length) {
    throw new Error('Password length must be at least the number of selected character types.')
  }

  const alphabet = [...new Set(groups.join(''))]
  const password = groups.map((group) => group[randomIndex(group.length, randomByte)])
  while (password.length < options.length) {
    password.push(alphabet[randomIndex(alphabet.length, randomByte)])
  }

  // Fisher–Yates shuffle prevents required characters from always appearing first.
  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, randomByte)
    ;[password[index], password[swapIndex]] = [password[swapIndex], password[index]]
  }

  return password.join('')
}
