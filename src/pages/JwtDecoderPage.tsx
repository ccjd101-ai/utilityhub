import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { decodeJwt, type DecodedJwt } from '../tools/jwt'

function JwtDecoderPage() {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  function decode() {
    try {
      setDecoded(decodeJwt(token))
      setError(false)
      setMessage('Token decoded. Its signature has not been verified.')
    } catch (reason) {
      setDecoded(null)
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to decode this token.')
    }
  }

  function clear() {
    setToken('')
    setDecoded(null)
    setError(false)
    setMessage('Token and decoded data cleared.')
  }

  return (
    <ToolLayout title="JWT Decoder" description="Inspect a JSON Web Token's header and payload locally. This tool only decodes; it does not verify signatures.">
      <div className="data-tool">
        <div className="data-tool-warning" role="note">
          Decoding does not verify the signature, issuer, audience, or trustworthiness of a token. Treat the displayed claims as untrusted data.
        </div>
        <div className="data-tool-single-editor">
          <label htmlFor="jwt-input">JSON Web Token</label>
          <textarea id="jwt-input" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste a three-part JWT…" spellCheck={false} autoCapitalize="off" autoCorrect="off" />
        </div>
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={decode}>Decode token</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        {decoded && (
          <div className="jwt-results">
            <section className="jwt-result" aria-labelledby="jwt-header-title">
              <h2 id="jwt-header-title">Header</h2>
              <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
            </section>
            <section className="jwt-result" aria-labelledby="jwt-payload-title">
              <h2 id="jwt-payload-title">Payload</h2>
              <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
            </section>
            <section className="jwt-signature" aria-label="Unverified signature segment">
              <strong>Signature segment (not verified)</strong>
              <code>{decoded.signature || '(empty)'}</code>
            </section>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

export default JwtDecoderPage
