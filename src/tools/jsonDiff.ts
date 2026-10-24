export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export type JsonDifferenceKind = 'added' | 'removed' | 'changed'

export interface JsonDifference {
  kind: JsonDifferenceKind
  path: string
  before?: JsonValue
  after?: JsonValue
}

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function propertyPath(path: string, key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`
}

export function diffJson(before: JsonValue, after: JsonValue): JsonDifference[] {
  const differences: JsonDifference[] = []

  function visit(left: JsonValue, right: JsonValue, path: string) {
    if (Object.is(left, right)) return

    if (Array.isArray(left) && Array.isArray(right)) {
      const maxLength = Math.max(left.length, right.length)
      for (let index = 0; index < maxLength; index += 1) {
        const itemPath = `${path}[${index}]`
        if (index >= left.length) {
          differences.push({ kind: 'added', path: itemPath, after: right[index] })
        } else if (index >= right.length) {
          differences.push({ kind: 'removed', path: itemPath, before: left[index] })
        } else {
          visit(left[index], right[index], itemPath)
        }
      }
      return
    }

    if (isObject(left) && isObject(right)) {
      const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])]
      for (const key of keys) {
        const itemPath = propertyPath(path, key)
        const inLeft = Object.hasOwn(left, key)
        const inRight = Object.hasOwn(right, key)

        if (!inLeft) {
          differences.push({ kind: 'added', path: itemPath, after: right[key] })
        } else if (!inRight) {
          differences.push({ kind: 'removed', path: itemPath, before: left[key] })
        } else {
          visit(left[key], right[key], itemPath)
        }
      }
      return
    }

    differences.push({ kind: 'changed', path, before: left, after: right })
  }

  visit(before, after, '$')
  return differences
}
