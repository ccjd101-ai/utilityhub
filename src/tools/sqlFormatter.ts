import { format, type SqlLanguage } from 'sql-formatter'

export type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'transactsql'

export function formatSql(query: string, dialect: SqlDialect): string {
  if (!query.trim()) throw new Error('Enter a SQL query to format.')
  return format(query, { language: dialect as SqlLanguage, tabWidth: 2, keywordCase: 'upper' })
}
