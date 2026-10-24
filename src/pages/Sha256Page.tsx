import { useRef, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import ToolTextarea from '../components/tools/ToolTextarea'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { hashSha256 } from '../tools/sha256'

function Sha256Page() {
  const [input, setInput] = useState('')
  const [digest, setDigest] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const requestId = useRef(0)
  const copyFeedback = useActionFeedback()

  async function hash() {
    const currentRequest = ++requestId.current
    const textToHash = input
    setBusy(true)
    try {
      const result = await hashSha256(textToHash)
      if (currentRequest !== requestId.current) return
      setDigest(result)
      setError(false)
      setMessage('SHA-256 digest computed locally in your browser.')
    } catch (reason) {
      if (currentRequest !== requestId.current) return
      setDigest('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to compute a SHA-256 digest.')
    } finally {
      if (currentRequest === requestId.current) setBusy(false)
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(digest)
      setError(false)
      setMessage('Digest copied to clipboard.')
      copyFeedback.showSuccess()
    } catch {
      setError(true)
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function clear() {
    requestId.current += 1
    setBusy(false)
    setInput('')
    setDigest('')
    setError(false)
    setMessage('Input and digest cleared.')
    copyFeedback.reset()
  }

  return (
    <ToolLayout title="SHA-256 Hash Generator" description="Calculate the SHA-256 digest of text with the browser Web Crypto API. Your input stays on this device.">
      <div className="security-tool">
        <ToolTextarea id="sha256-input" label="Text to hash" value={input} onChange={(value) => { requestId.current += 1; setBusy(false); setInput(value); setDigest(''); setMessage('') }} placeholder="Type or paste text to calculate its SHA-256 digest…" />
        <ToolTextarea id="sha256-output" label="SHA-256 digest (hex)" value={digest} readOnly placeholder="The 64-character hexadecimal digest will appear here." />
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={() => void hash()} disabled={busy}>{busy ? 'Hashing…' : 'Generate SHA-256 hash'}</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!digest} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy digest</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        <div className="data-tool-warning">SHA-256 is a one-way hash function, not encryption. A digest does not prove who created the input or whether it is trustworthy. Do not use this tool as a password-storage system.</div>
        <p className="data-tool-note">Input is processed locally with Web Crypto and is not uploaded by UtilityHub.</p>
      </div>
    </ToolLayout>
  )
}

export default Sha256Page
