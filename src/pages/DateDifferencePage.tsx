import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import { calculateDateDifference } from '../tools/dateTime'
import ThemedDateTimePicker from '../components/tools/ThemedDateTimePicker'

function DateDifferencePage() {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [result, setResult] = useState<ReturnType<typeof calculateDateDifference> | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  function calculate() {
    try {
      const difference = calculateDateDifference(start, end)
      setResult(difference)
      setError(false)
      setMessage(difference.direction === 'same' ? 'The two date-times are the same.' : `End date is ${difference.direction} the start date.`)
    } catch (reason) {
      setResult(null)
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to calculate this difference.')
    }
  }

  return (
    <ToolLayout title="Date Difference Calculator" description="Calculate the elapsed time between two dates and times. Inputs use your browser's local time zone; no data is uploaded.">
      <div className="date-time-tool">
        <div className="date-time-fields">
          <ThemedDateTimePicker id="difference-start" label="Start date and time" value={start} onChange={setStart} />
          <ThemedDateTimePicker id="difference-end" label="End date and time" value={end} onChange={setEnd} />
        </div>
        <button type="button" className="date-time-button" onClick={calculate}>Calculate difference</button>
        {result && <div className="date-time-results date-difference-results" aria-live="polite" aria-atomic="true">
          <div><span>Elapsed time</span><output>{result.days} days, {result.hours} hours, {result.minutes} minutes, {result.seconds} seconds</output></div>
          <div><span>Total days (fractional)</span><output>{(Math.abs(result.milliseconds) / 86_400_000).toLocaleString(undefined, { maximumFractionDigits: 6 })}</output></div>
          <div><span>Total hours</span><output>{(Math.abs(result.milliseconds) / 3_600_000).toLocaleString(undefined, { maximumFractionDigits: 4 })}</output></div>
        </div>}
        <p className={`date-time-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        <p className="date-time-note">Elapsed duration is calculated in seconds between the selected local date-times. It is not a calendar-month or business-day calculation.</p>
      </div>
    </ToolLayout>
  )
}

export default DateDifferencePage
