import { useState } from 'react'
import { convertTimestamp, type TimestampUnit } from '../tools/dateTime'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'

function UnixTimestampPage() {
  const [input, setInput] = useState('')
  const [unit, setUnit] = useState<TimestampUnit | 'auto'>('auto')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const result = (() => {
    try { return input ? convertTimestamp(input, unit) : null }
    catch { return null }
  })()

  function convert() {
    try {
      const value = convertTimestamp(input, unit)
      setError(false)
      setMessage(`Interpreted as Unix ${value.detectedUnit}.`)
    } catch (reason) {
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to convert timestamp.')
    }
  }

  return (
    <ToolLayout title="Unix Timestamp Converter" description="Convert Unix timestamps to readable dates, or choose seconds or milliseconds explicitly. Conversion happens in your browser.">
      <div className="date-time-tool">
        <div className="date-time-field">
          <label htmlFor="unix-timestamp">Unix timestamp</label>
          <input id="unix-timestamp" inputMode="decimal" value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. 1700000000" />
        </div>
        <div className="date-time-narrow">
          <ThemedSelect
            id="unix-unit"
            label="Timestamp unit"
            value={unit}
            onChange={(value) => setUnit(value as TimestampUnit | 'auto')}
            options={[
              { value: 'auto', label: 'Detect automatically' },
              { value: 'seconds', label: 'Seconds' },
              { value: 'milliseconds', label: 'Milliseconds' },
            ]}
          />
        </div>
        <div className="date-time-results" aria-live="polite" aria-atomic="true">
          <div><span>ISO 8601 (UTC)</span><output>{result?.iso ?? 'Converted date appears here.'}</output></div>
          <div><span>Unix seconds</span><output>{result ? String(Math.floor(result.milliseconds / 1000)) : '—'}</output></div>
          <div><span>Unix milliseconds</span><output>{result ? String(result.milliseconds) : '—'}</output></div>
          <div><span>Detected unit</span><output>{result?.detectedUnit ?? '—'}</output></div>
        </div>
        <button type="button" className="date-time-button" onClick={convert}>Validate timestamp</button>
        <p className={`date-time-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default UnixTimestampPage
