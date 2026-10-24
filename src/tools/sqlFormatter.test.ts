import { describe, expect, it } from 'vitest'
import { formatSql } from './sqlFormatter'

describe('formatSql', () => {
  it('formats queries and normalizes keyword casing', () => {
    expect(formatSql('select id,name from users where id=1', 'postgresql'))
      .toContain('SELECT')
    expect(formatSql('select id,name from users where id=1', 'postgresql'))
      .toContain('FROM\n  users')
  })

  it('supports selectable dialects', () => {
    expect(formatSql('select 1', 'mysql')).toContain('SELECT')
    expect(formatSql('select 1', 'sqlite')).toContain('SELECT')
    expect(formatSql('select 1', 'transactsql')).toContain('SELECT')
  })

  it('rejects empty input', () => {
    expect(() => formatSql('  ', 'sql')).toThrow('Enter a SQL query')
  })
})
