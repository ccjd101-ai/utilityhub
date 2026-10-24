import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import { formatDateTime } from '../tools/dateTime'

const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
const formats = [
  ['iso', 'ISO 8601 (UTC)'],
  ['utc', 'UTC string'],
  ['local', 'Localized date and time'],
  ['date', 'Localized date'],
  ['time', 'Localized time'],
] as const

function DateTimeFormatPage() {
  const [dateTime, setDateTime] = useState('')
  const [timeZone, setTimeZone] = useState(browserZone)
  const [format, setFormat] = useState<(typeof formats)[number][0]>('iso')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [output, setOutput] = useState('')

  function convert() {
    try {
      if (!dateTime) throw new Error('Choose a date and time to format.')
      const result = formatDateTime(new Date(dateTime), timeZone, format)
      setOutput(result)
      setError(false)
      setMessage('Date and time formatted.')
    } catch (reason) {
      setOutput('')
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to format date and time.')
    }
  }

  return (
    <ToolLayout title="Date/Time Format Converter" description="Format a date and time as ISO 8601, UTC, or a localized date/time in a chosen time zone.">
      <div className="date-time-tool">
        <div className="date-time-fields date-time-fields-three">
          <div className="date-time-field"><label htmlFor="format-input">Date and time</label><input id="format-input" type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} /></div>
          <div className="date-time-field"><label htmlFor="format-zone">Display time zone</label><input id="format-zone" value={timeZone} onChange={(event) => setTimeZone(event.target.value)} placeholder="e.g. Europe/Paris" /></div>
          <div className="date-time-field"><label htmlFor="format-style">Output format</label><select id="format-style" value={format} onChange={(event) => setFormat(event.target.value as typeof format)}>{formats.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        </div>
        <button type="button" className="date-time-button" onClick={convert}>Format date and time</button>
        <div className="date-time-results"><div><span>Formatted output</span><output aria-live="polite" aria-atomic="true">{output || 'Formatted date and time appears here.'}</output></div></div>
        <p className={`date-time-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        <p className="date-time-note">Localized formats follow your browser language settings. ISO 8601 and UTC string outputs are in UTC.</p>
      </div>
    </ToolLayout>
  )
}

export default DateTimeFormatPage
