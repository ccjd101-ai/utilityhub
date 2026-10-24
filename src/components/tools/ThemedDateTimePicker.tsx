import { useEffect, useId, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface ThemedDateTimePickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function parseValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]))
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function makeValue(date: Date, hour: number, minute: number): string {
  return `${dateKey(date)}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function ThemedDateTimePicker({ id, label, value, onChange }: ThemedDateTimePickerProps) {
  const generatedId = useId()
  const dialogId = `${generatedId}-calendar`
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedDate = parseValue(value)
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date())
  const [hour, setHour] = useState(selectedDate ? String(selectedDate.getHours()).padStart(2, '0') : '09')
  const [minute, setMinute] = useState(selectedDate ? String(selectedDate.getMinutes()).padStart(2, '0') : '00')

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const firstDayOffset = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const days = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstDayOffset + 1
    return day < 1 || day > daysInMonth ? null : new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
  })
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate)
  const displayValue = selectedDate
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(selectedDate)
    : 'Choose date and time'

  function setSelectedDate(date: Date) {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setViewDate(normalized)
    const now = new Date()
    const isToday = dateKey(normalized) === dateKey(now)
    const nextHour = selectedDate ? selectedDate.getHours() : isToday ? now.getHours() : 9
    const nextMinute = selectedDate ? selectedDate.getMinutes() : isToday ? now.getMinutes() : 0
    const nextHourString = String(nextHour).padStart(2, '0')
    const nextMinuteString = String(nextMinute).padStart(2, '0')
    setHour(nextHourString)
    setMinute(nextMinuteString)
    onChange(makeValue(normalized, nextHour, nextMinute))
  }

  function changeTime(nextHour: string, nextMinute: string) {
    setHour(nextHour)
    setMinute(nextMinute)
    const hourValue = Number(nextHour)
    const minuteValue = Number(nextMinute)
    if (selectedDate && nextHour !== '' && nextMinute !== ''
      && hourValue >= 0 && hourValue <= 23 && minuteValue >= 0 && minuteValue <= 59) {
      onChange(makeValue(selectedDate, hourValue, minuteValue))
    }
  }

  function shiftMonth(amount: number) {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1))
  }

  return (
    <div className="themed-date-picker" ref={rootRef}>
      <label className="themed-date-picker-label" htmlFor={id}>{label}</label>
      <button
        id={id}
        type="button"
        className={`themed-date-picker-trigger${open ? ' is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="themed-date-picker-value">{displayValue}</span>
        <CalendarDays size={18} aria-hidden="true" />
      </button>
      {open && (
        <section id={dialogId} className="themed-calendar-popover" role="dialog" aria-label={`${label} calendar`}>
          <div className="themed-calendar-header">
            <button type="button" className="themed-calendar-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month"><ChevronLeft size={18} aria-hidden="true" /></button>
            <h3 aria-live="polite">{monthLabel}</h3>
            <button type="button" className="themed-calendar-nav" onClick={() => shiftMonth(1)} aria-label="Next month"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
          <div className="themed-calendar-grid">
            {weekdays.map((weekday) => <span className="themed-calendar-weekday" key={weekday}>{weekday}</span>)}
            {days.map((date, index) => date ? (
              <button
                type="button"
                key={dateKey(date)}
                className={`themed-calendar-day${selectedDate && dateKey(date) === dateKey(selectedDate) ? ' is-selected' : ''}${dateKey(date) === dateKey(new Date()) ? ' is-today' : ''}`}
                aria-label={new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(date)}
                aria-pressed={Boolean(selectedDate && dateKey(date) === dateKey(selectedDate))}
                onClick={() => setSelectedDate(date)}
              >
                {date.getDate()}
              </button>
            ) : <span className="themed-calendar-empty" key={`empty-${index}`} aria-hidden="true" />)}
          </div>
          <div className="themed-calendar-time">
            <span className="themed-calendar-time-label">Time</span>
            <label><span>Hour</span><input aria-label="Hour" type="number" min="0" max="23" value={hour} onChange={(event) => changeTime(event.target.value, minute)} /></label>
            <span className="themed-calendar-time-separator" aria-hidden="true">:</span>
            <label><span>Minute</span><input aria-label="Minute" type="number" min="0" max="59" value={minute} onChange={(event) => changeTime(hour, event.target.value)} /></label>
          </div>
          <div className="themed-calendar-footer">
            <button type="button" className="themed-calendar-today" onClick={() => setSelectedDate(new Date())}>Today</button>
            <button type="button" className="themed-calendar-done" onClick={() => setOpen(false)} disabled={!selectedDate}>Done</button>
          </div>
        </section>
      )}
    </div>
  )
}

export default ThemedDateTimePicker
