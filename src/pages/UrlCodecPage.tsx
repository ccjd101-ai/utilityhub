import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import ThemedSelect from '../components/tools/ThemedSelect'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { decodeUrl, encodeUrl, type UrlEncodingMode } from '../tools/urlCodec'

function UrlCodecPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<UrlEncodingMode>('component')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()

  function run(operation: 'encode' | 'decode') {
    try {
      setOutput(operation === 'encode' ? encodeUrl(input, mode) : decodeUrl(input, mode))
      setError(false)
      setMessage(operation === 'encode' ? 'URL text encoded.' : 'URL text decoded.')
    } catch (reason) {
      setOutput('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to convert input.')
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
    <ToolLayout title="URL Encoder / Decoder" description="Encode or decode a full URL or an individual URL component without sending data anywhere.">
      <div className="data-tool">
        <div className="data-tool-toolbar">
          <ThemedSelect id="url-mode" label="Encoding mode" value={mode} onChange={(value) => setMode(value as UrlEncodingMode)} options={[
            { value: 'component', label: 'URL component (encodes reserved characters)' },
            { value: 'url', label: 'Full URL (preserves URL separators)' },
          ]} />
        </div>
        <div className="data-tool-editors">
          <ToolTextarea id="url-input" label="Input" value={input} onChange={setInput} placeholder="Type text or paste a URL…" />
          <ToolTextarea id="url-output" label="Result" value={output} readOnly placeholder="The converted result will appear here." />
        </div>
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={() => run('encode')}>Encode</ActionButton>
          <ActionButton onClick={() => run('decode')}>Decode</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!output} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy result</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default UrlCodecPage
