import { Braces, FileDiff, Hash, Type } from 'lucide-react'
import type { ToolDefinition } from './types'

export const tools: ToolDefinition[] = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data instantly.',
    category: 'DEVELOPERS',
    href: '/tools/json-formatter',
    icon: Braces,
    accent: 'green',
  },
  {
    title: 'JSON Diff',
    description: 'Compare JSON and spot differences with ease.',
    category: 'DEVELOPERS',
    href: '/tools/json-diff',
    icon: FileDiff,
    accent: 'red',
  },
  {
    title: 'Text Formatter',
    description: 'Clean, format and transform text in seconds.',
    category: 'PRODUCTIVITY',
    href: '/tools/text-formatter',
    icon: Type,
    accent: 'blue',
  },
  {
    title: 'GUID Generator',
    description: 'Generate UUIDs and GUIDs for your projects.',
    category: 'DEVELOPERS',
    href: '/tools/guid-generator',
    icon: Hash,
    accent: 'orange',
  },
]

export function getToolByPath(path: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.href === path)
}
