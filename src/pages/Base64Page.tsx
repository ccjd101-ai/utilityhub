import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { decodeBase64, encodeBase64 } from '../tools/base64'

function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()

  function run(mode: 'encode' | 'decode') {
    try {
      setOutput(mode === 'encode' ? encodeBase64(input) : decodeBase64(input))
      setError(false)
      setMessage(mode === 'encode' ? 'Text encoded.' : 'Base64 decoded as UTF-8 text.')
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
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode text to Base64 or decode Base64 back to Unicode text, locally in your browser.">
      <div className="data-tool">
        <p className="data-tool-note">Base64 is an encoding format, not encryption. Decoding expects UTF-8 text.</p>
        <div className="data-tool-editors">
          <ToolTextarea id="base64-input" label="Input" value={input} onChange={setInput} placeholder="Type text or paste Base64…" />
          <ToolTextarea id="base64-output" label="Result" value={output} readOnly placeholder="The converted result will appear here." />
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

export default Base64Page
