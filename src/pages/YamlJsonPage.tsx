import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { jsonToYaml, yamlToJson } from '../tools/yamlJson'

function YamlJsonPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [direction, setDirection] = useState<'yaml-json' | 'json-yaml'>('yaml-json')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()
  const inputLabel = direction === 'yaml-json' ? 'YAML input' : 'JSON input'
  const outputLabel = direction === 'yaml-json' ? 'JSON output' : 'YAML output'

  function convert() {
    try {
      setOutput(direction === 'yaml-json' ? yamlToJson(input) : jsonToYaml(input))
      setError(false)
      setMessage(direction === 'yaml-json' ? 'YAML converted to JSON.' : 'JSON converted to YAML.')
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
    <ToolLayout title="YAML ↔ JSON Converter" description="Convert YAML and JSON documents in either direction, with parse errors surfaced in your browser.">
      <div className="data-tool">
        <div className="data-tool-toolbar">
          <label htmlFor="yaml-json-direction">Conversion</label>
          <select id="yaml-json-direction" value={direction} onChange={(event) => { setDirection(event.target.value as typeof direction); setOutput(''); setMessage('') }}>
            <option value="yaml-json">YAML to JSON</option>
            <option value="json-yaml">JSON to YAML</option>
          </select>
        </div>
        <p className="data-tool-note">Uses the YAML 1.2 core schema and rejects duplicate mapping keys. Custom YAML tags and multiple documents are not supported.</p>
        <div className="data-tool-editors">
          <ToolTextarea id="yaml-json-input" label={inputLabel} value={input} onChange={setInput} placeholder={direction === 'yaml-json' ? 'name: UtilityHub\ntags:\n  - tools' : '{"name":"UtilityHub","tags":["tools"]}'} />
          <ToolTextarea id="yaml-json-output" label={outputLabel} value={output} readOnly placeholder="The converted document will appear here." />
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

export default YamlJsonPage
