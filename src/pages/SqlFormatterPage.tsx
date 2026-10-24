import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { formatSql, type SqlDialect } from '../tools/sqlFormatter'

function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()

  function format() {
    try {
      setOutput(formatSql(input, dialect))
      setError(false)
      setMessage('SQL formatted. Query syntax is not validated.')
    } catch (reason) {
      setOutput('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to format this SQL.')
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output)
      setError(false)
      setMessage('Result copied to clipboard.')
      copyFeedback.showSuccess()
    } catch {
      setError(true)
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function clear() {
    setInput('')
    setOutput('')
    setError(false)
    setMessage('Input and result cleared.')
    copyFeedback.reset()
  }

  return (
    <ToolLayout title="SQL Formatter" description="Format SQL queries with a dialect-aware formatter. Queries stay in your browser.">
      <div className="data-tool">
        <div className="data-tool-toolbar">
          <ThemedSelect id="sql-dialect" label="SQL dialect" value={dialect} onChange={(value) => setDialect(value as SqlDialect)} options={[
            { value: 'sql', label: 'Standard SQL' },
            { value: 'postgresql', label: 'PostgreSQL' },
            { value: 'mysql', label: 'MySQL' },
            { value: 'sqlite', label: 'SQLite' },
            { value: 'transactsql', label: 'SQL Server (T-SQL)' },
          ]} />
        </div>
        <p className="data-tool-note">Formatting adjusts layout and keyword casing. It does not validate or execute SQL.</p>
        <div className="data-tool-editors">
          <ToolTextarea id="sql-input" label="SQL input" value={input} onChange={setInput} placeholder="Paste a SQL query…" />
          <ToolTextarea id="sql-output" label="Formatted SQL" value={output} readOnly placeholder="The formatted query will appear here." />
        </div>
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={format}>Format SQL</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!output} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy result</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default SqlFormatterPage
