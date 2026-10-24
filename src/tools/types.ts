import type { LucideIcon } from 'lucide-react'

export type ToolCategory =
  | 'DEVELOPERS'
  | 'TEXT_WRITING'
  | 'DATE_TIME'
  | 'SECURITY_HASHING'
  | 'COLOR_IMAGE_WEB'
  | 'CALCULATORS_CONVERTERS'

export type ToolAccent = 'green' | 'red' | 'blue' | 'orange'

export interface ToolDefinition {
  title: string
  description: string
  category: ToolCategory
  href: string
  icon: LucideIcon
  accent: ToolAccent
}
