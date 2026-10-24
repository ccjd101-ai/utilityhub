export interface RegexMatch {
  value: string
  index: number
  groups: string[]
}

export function findRegexMatches(
  pattern: string,
  flags: string,
  input: string,
  maxMatches = 500,
): RegexMatch[] {
  const allFlags = flags.includes('g') ? flags : `${flags}g`
  const expression = new RegExp(pattern, allFlags)
  const matches: RegexMatch[] = []

  for (const match of input.matchAll(expression)) {
    if (matches.length >= maxMatches) break
    matches.push({
      value: match[0],
      index: match.index,
      groups: match.slice(1).map((group) => group ?? ''),
    })
  }

  return matches
}
