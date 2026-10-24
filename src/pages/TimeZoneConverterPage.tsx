import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import { formatDateTime, localTimeInZoneToDate } from '../tools/dateTime'
import ThemedDateTimePicker from '../components/tools/ThemedDateTimePicker'
import ThemedSelect from '../components/tools/ThemedSelect'

const zones = [
  'UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
  'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Africa/Johannesburg',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
]
const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
const zoneOptions = [...new Set([browserZone, ...zones])]

function TimeZoneConverterPage() {
  const [dateTime, setDateTime] = useState('')
  const [fromZone, setFromZone] = useState(browserZone)
  const [toZone, setToZone] = useState('UTC')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [converted, setConverted] = useState<{ instant: Date; output: string } | null>(null)

  function convert() {
    try {
      const instant = localTimeInZoneToDate(dateTime, fromZone)
      const output = formatDateTime(instant, toZone, 'local')
      setConverted({ instant, output })
      setError(false)
      setMessage('Time-zone conversion complete. The selected wall time is treated as a time in the source zone.')
    } catch (reason) {
      setConverted(null)
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to convert this local time.')
    }
  }

  return (
    <ToolLayout title="Time-Zone Converter" description="Convert a local date and time between IANA time zones. Daylight-saving gaps are detected; all conversion stays in your browser.">
      <div className="date-time-tool">
        <div className="date-time-fields date-time-fields-three">
          <ThemedDateTimePicker id="timezone-input" label="Date and time" value={dateTime} onChange={setDateTime} />
          <ThemedSelect id="timezone-from" label="From time zone" value={fromZone} onChange={setFromZone} options={zoneOptions.map((zone) => ({ value: zone, label: zone }))} />
          <ThemedSelect id="timezone-to" label="To time zone" value={toZone} onChange={setToZone} options={zoneOptions.map((zone) => ({ value: zone, label: zone }))} />
        </div>
        <button type="button" className="date-time-button" onClick={convert}>Convert time</button>
        <div className="date-time-results" aria-live="polite" aria-atomic="true">
          <div><span>Converted time ({toZone})</span><output>{converted?.output ?? 'Converted time appears here.'}</output></div>
          <div><span>Equivalent UTC instant</span><output>{converted?.instant.toISOString() ?? '—'}</output></div>
        </div>
        <p className={`date-time-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default TimeZoneConverterPage
