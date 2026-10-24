import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import ThemedSelect from '../components/tools/ThemedSelect'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { csvToJson, jsonToCsv } from '../tools/csvJson'

function CsvJsonPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [direction, setDirection] = useState<'csv-json' | 'json-csv'>('csv-json')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()
  const inputLabel = direction === 'csv-json' ? 'CSV input' : 'JSON input'
  const outputLabel = direction === 'csv-json' ? 'JSON output' : 'CSV output'

  function convert() {
    try {
      setOutput(direction === 'csv-json' ? csvToJson(input) : jsonToCsv(input))
      setError(false)
      setMessage(direction === 'csv-json' ? 'CSV converted to JSON.' : 'JSON converted to CSV.')
    } catch (reason) {
      setOutput('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to convert this data.')
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
    <ToolLayout title="CSV ↔ JSON Converter" description="Convert CSV and JSON data in either direction, with proper handling for quoted fields and multiline values.">
      <div className="data-tool">
        <div className="data-tool-toolbar">
          <ThemedSelect id="csv-json-direction" label="Conversion" value={direction} onChange={(value) => { setDirection(value as typeof direction); setOutput(''); setMessage('') }} options={[
            { value: 'csv-json', label: 'CSV to JSON' },
            { value: 'json-csv', label: 'JSON to CSV' },
          ]} />
        </div>
        <p className="data-tool-note">CSV input uses its first row as column headers, and CSV cells are kept as strings. JSON input must be an array of flat objects; nested values are not representable in CSV.</p>
        <div className="data-tool-editors">
          <ToolTextarea id="csv-json-input" label={inputLabel} value={input} onChange={setInput} placeholder={direction === 'csv-json' ? 'name,note\nAda,"Hello, world"' : '[{"name":"Ada","note":"Hello, world"}]'} />
          <ToolTextarea id="csv-json-output" label={outputLabel} value={output} readOnly placeholder="The converted data will appear here." />
        </div>
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={convert}>Convert</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!output} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy result</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default CsvJsonPage
