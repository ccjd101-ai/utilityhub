import { parse, stringify } from 'yaml'

export function yamlToJson(source: string): string {
  if (!source.trim()) throw new Error('Enter YAML data to convert.')
  try {
    const parsed: unknown = parse(source, { uniqueKeys: true, maxAliasCount: 100 })
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid YAML input.', {
      cause: error,
    })
  }
}

export function jsonToYaml(source: string): string {
  if (!source.trim()) throw new Error('Enter JSON data to convert.')
  try {
    const parsed: unknown = JSON.parse(source) as unknown
    return stringify(parsed)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON input.', {
      cause: error,
    })
  }
}
