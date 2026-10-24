import { diffLines } from 'diff'

export type TextDiffKind = 'unchanged' | 'added' | 'removed'

export interface TextDiffPart {
  kind: TextDiffKind
  value: string
}

export function compareText(original: string, updated: string): TextDiffPart[] {
  return diffLines(original, updated).map((part) => ({
    kind: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
    value: part.value,
  }))
}
