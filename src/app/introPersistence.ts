const INTRO_KEY = 'utilityhub:intro-completed:v1'

export function hasSeenIntro(storage?: Pick<Storage, 'getItem'>): boolean {
  try {
    return (storage ?? window.localStorage).getItem(INTRO_KEY) === 'true'
  } catch {
    return false
  }
}

export function markIntroSeen(storage?: Pick<Storage, 'setItem'>): void {
  try {
    ;(storage ?? window.localStorage).setItem(INTRO_KEY, 'true')
  } catch {
    // The homepage remains usable when browser storage is unavailable.
  }
}
