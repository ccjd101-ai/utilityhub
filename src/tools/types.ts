import type { LucideIcon } from 'lucide-react'

export type ToolCategory = 'DEVELOPERS' | 'PRODUCTIVITY'

export type ToolAccent = 'green' | 'red' | 'blue' | 'orange'

export interface ToolDefinition {
  title: string
  description: string
  category: ToolCategory
  href: string
  icon: LucideIcon
  accent: ToolAccent
}
