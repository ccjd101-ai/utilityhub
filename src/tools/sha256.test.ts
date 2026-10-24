import { describe, expect, it } from 'vitest'
import { hashSha256 } from './sha256'

describe('hashSha256', () => {
  it('matches the SHA-256 known-answer vectors', async () => {
    await expect(hashSha256('')).resolves.toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    await expect(hashSha256('abc')).resolves.toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('hashes Unicode input as UTF-8', async () => {
    await expect(hashSha256('café 🌿')).resolves.toHaveLength(64)
  })
})
