import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { isUuidGuidFormat } from '../tools/uuidValidator'

function UuidValidatorPage() {
  const [input, setInput] = useState('')
  const normalizedInput = input.trim()
  const isValidFormat = normalizedInput ? isUuidGuidFormat(normalizedInput) : null

  return (
    <ToolLayout title="UUID/GUID Validator" description="Check whether a value matches the common hyphenated UUID/GUID text layout. Validation happens in your browser.">
      <div className="security-tool">
        <div className="data-tool-field">
          <label htmlFor="uuid-guid-input">UUID/GUID string</label>
          <input id="uuid-guid-input" type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
        </div>
        <div className={`uuid-validation-result${isValidFormat === null ? '' : isValidFormat ? ' is-valid' : ' is-invalid'}`} role="status" aria-live="polite" aria-atomic="true">
          <span className="uuid-validation-indicator" aria-hidden="true">{isValidFormat === null ? '—' : isValidFormat ? '✓' : '×'}</span>
          <div>
            <strong>{isValidFormat === null ? 'Enter a UUID/GUID to check its format' : isValidFormat ? 'UUID/GUID format recognized' : 'UUID/GUID format not recognized'}</strong>
            <span>{isValidFormat === null ? 'Accepts the standard 8-4-4-4-12 hexadecimal layout, optionally wrapped in braces.' : isValidFormat ? 'The value matches the expected text layout.' : 'Check the hexadecimal characters, group lengths, hyphens, and optional braces.'}</span>
          </div>
        </div>
        <div className="data-tool-actions">
          <ActionButton onClick={() => setInput('')} disabled={!input}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <div className="data-tool-warning">This checks formatting only. It does not validate a UUID version, uniqueness, source, ownership, or authenticity.</div>
        <p className="data-tool-note">The value is checked locally in your browser and is not uploaded by UtilityHub.</p>
      </div>
    </ToolLayout>
  )
}

export default UuidValidatorPage
