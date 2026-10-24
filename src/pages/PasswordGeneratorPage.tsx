import { useState } from 'react'
import { Copy, Eye, EyeOff, RefreshCw, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { generatePassword } from '../tools/passwordGenerator'

function PasswordGeneratorPage() {
  const [length, setLength] = useState('20')
  const [lowercase, setLowercase] = useState(true)
  const [uppercase, setUppercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()

  function generate() {
    try {
      const result = generatePassword({
        length: Number(length), lowercase, uppercase, numbers, symbols, excludeAmbiguous,
      })
      setPassword(result)
      setShowPassword(false)
      setError(false)
      setMessage('Password generated locally with the browser cryptographic random number generator.')
      copyFeedback.reset()
    } catch (reason) {
      setPassword('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to generate a password in this browser.')
      copyFeedback.showError()
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password)
      setError(false)
      setMessage('Password copied to clipboard.')
      copyFeedback.showSuccess()
    } catch {
      setError(true)
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function clear() {
    setPassword('')
    setMessage('Password cleared.')
    setError(false)
    setShowPassword(false)
    copyFeedback.reset()
  }

  return (
    <ToolLayout title="Secure Password Generator" description="Generate a random password using your browser's cryptographic random number generator. All generation happens locally.">
      <div className="security-tool">
        <div className="data-tool-field security-length-field">
          <label htmlFor="password-length">Password length</label>
          <input id="password-length" type="number" min="8" max="128" step="1" value={length} onChange={(event) => setLength(event.target.value)} aria-describedby="password-length-hint" />
          <span id="password-length-hint" className="data-tool-hint">Choose between 8 and 128 characters.</span>
        </div>

        <fieldset className="security-character-options">
          <legend>Include character types</legend>
          <label><input type="checkbox" checked={lowercase} onChange={(event) => setLowercase(event.target.checked)} />Lowercase letters <code>a–z</code></label>
          <label><input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} />Uppercase letters <code>A–Z</code></label>
          <label><input type="checkbox" checked={numbers} onChange={(event) => setNumbers(event.target.checked)} />Numbers <code>0–9</code></label>
          <label><input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />Symbols</label>
          <label className="security-ambiguous-option"><input type="checkbox" checked={excludeAmbiguous} onChange={(event) => setExcludeAmbiguous(event.target.checked)} />Exclude look-alike characters <code>O, 0, I, l, 1, |</code></label>
        </fieldset>

        <div className="security-password-field">
          <label htmlFor="generated-password">Generated password</label>
          <div className="security-password-input-row">
            <input id="generated-password" type={showPassword ? 'text' : 'password'} value={password} readOnly autoComplete="new-password" spellCheck={false} placeholder="Your password will appear here." />
            <button type="button" className="security-reveal-button" onClick={() => setShowPassword((shown) => !shown)} disabled={!password} aria-label={showPassword ? 'Hide generated password' : 'Show generated password'}>
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={generate}><RefreshCw size={16} aria-hidden="true" />Generate password</ActionButton>
          <ActionButton onClick={() => void copy()} disabled={!password} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        <p className="data-tool-note">Your password is generated and displayed in this browser; it is not uploaded or saved by UtilityHub. Avoid sharing it, and use a trusted password manager to store it.</p>
      </div>
    </ToolLayout>
  )
}

export default PasswordGeneratorPage
