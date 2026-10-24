import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { transformLines, type LineOperation } from '../tools/lineTools'

function LineToolsPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [operation, setOperation] = useState<LineOperation>('unique')
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()

  function run() {
    setOutput(transformLines(input, operation, caseInsensitive))
    setError(false)
    setMessage(operation === 'unique' ? 'Duplicate lines removed.' : 'Lines sorted.')
  }

  async function copy() {
    if (!output) return
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
    <ToolLayout title="Line Tools" description="Remove duplicate lines or sort a list of lines, with optional case-insensitive deduplication.">
      <div className="writing-tool">
        <div className="data-tool-toolbar">
          <label htmlFor="line-operation">Operation</label>
          <select id="line-operation" value={operation} onChange={(event) => setOperation(event.target.value as LineOperation)}>
            <option value="unique">Remove duplicate lines</option>
            <option value="sort-ascending">Sort A to Z</option>
            <option value="sort-descending">Sort Z to A</option>
          </select>
        </div>
        {operation === 'unique' && (
          <label className="line-case-option">
            <input type="checkbox" checked={caseInsensitive} onChange={(event) => setCaseInsensitive(event.target.checked)} />
            Ignore letter case when checking duplicates
          </label>
        )}
        <div className="data-tool-editors">
          <ToolTextarea id="line-input" label="Input lines" value={input} onChange={setInput} placeholder={'pear\napple\npear'} />
          <ToolTextarea id="line-output" label="Result" value={output} readOnly placeholder="The transformed lines will appear here." />
        </div>
        <div className="writing-tool-actions">
          <ActionButton variant="primary" onClick={run}>Apply</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!output} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy result</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`writing-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default LineToolsPage
