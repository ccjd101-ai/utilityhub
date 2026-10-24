import { useEffect, useId, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface ThemedDateTimePickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function getFirstWeekday(): number {
  try {
    const locale = new Intl.Locale(Intl.DateTimeFormat().resolvedOptions().locale) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const firstDay = locale.weekInfo?.firstDay ?? locale.getWeekInfo?.().firstDay ?? 1
    return firstDay % 7
  } catch {
    return 1
  }
}

const firstWeekday = getFirstWeekday()
const weekdays = Array.from({ length: 7 }, (_, index) => {
  const mondayOffset = (firstWeekday + 6) % 7
  return new Intl.DateTimeFormat(undefined, { weekday: 'short' })
    .format(new Date(2024, 0, 1 + mondayOffset + index))
})
const monthNames = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2024, month, 1)),
)
type CalendarView = 'days' | 'months' | 'years' | 'decades'

interface DateTimeParts {
  date: Date
  hour: number
  minute: number
}

function parseValue(value: string): DateTimeParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const [, yearText, monthText, dayText, hourText, minuteText] = match
  const year = Number(yearText)
  const month = Number(monthText) - 1
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)
  // Use midday for the calendar date so wall times in another zone aren't
  // normalized by the browser's own daylight-saving rules.
  const date = new Date(year, month, day, 12)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day
    || hour > 23 || minute > 59) return null
  return { date, hour, minute }
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
  const pendingFocusDate = useRef<string | null>(null)
  const pendingFocusControl = useRef<string | null>(null)
  const selectedDate = parseValue(value)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<CalendarView>('days')
  const [viewDate, setViewDate] = useState(() => selectedDate?.date ?? new Date())
  const [hour, setHour] = useState(selectedDate ? String(selectedDate.hour).padStart(2, '0') : '09')
  const [minute, setMinute] = useState(selectedDate ? String(selectedDate.minute).padStart(2, '0') : '00')

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        rootRef.current?.querySelector<HTMLButtonElement>('.themed-date-picker-trigger')?.focus()
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (view === 'days' && pendingFocusDate.current) {
      const day = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('.themed-calendar-day') ?? [])
        .find((button) => button.dataset.date === pendingFocusDate.current)
      day?.focus()
      pendingFocusDate.current = null
    }
    if (pendingFocusControl.current) {
      rootRef.current?.querySelector<HTMLButtonElement>(pendingFocusControl.current)?.focus()
      pendingFocusControl.current = null
    }
  }, [open, view, viewDate])

  const firstDayOffset = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() - firstWeekday + 7) % 7
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const days = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstDayOffset + 1
    return day < 1 || day > daysInMonth ? null : new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
  })
  const year = viewDate.getFullYear()
  const decadeStart = Math.floor(year / 10) * 10
  const centuryStart = Math.floor(year / 100) * 100
  const yearChoices = Array.from({ length: 12 }, (_, index) => decadeStart - 1 + index)
  const decadeChoices = Array.from({ length: 12 }, (_, index) => centuryStart - 10 + index * 10)
  const displayValue = selectedDate
    ? `${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(selectedDate.date)} · ${String(selectedDate.hour).padStart(2, '0')}:${String(selectedDate.minute).padStart(2, '0')}`
    : 'Choose date and time'

  function setSelectedDate(date: Date) {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setViewDate(normalized)
    setView('days')
    const now = new Date()
    const isToday = dateKey(normalized) === dateKey(now)
    const nextHour = selectedDate ? selectedDate.hour : isToday ? now.getHours() : 9
    const nextMinute = selectedDate ? selectedDate.minute : isToday ? now.getMinutes() : 0
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
      onChange(makeValue(selectedDate.date, hourValue, minuteValue))
    }
  }

  function shiftMonth(amount: number) {
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1))
  }

  function shiftYear(amount: number) {
    setViewDate((date) => new Date(date.getFullYear() + amount, date.getMonth(), 1))
  }

  function shiftDecade(amount: number) {
    setViewDate((date) => new Date(date.getFullYear() + amount * 10, date.getMonth(), 1))
  }

  function shiftCentury(amount: number) {
    setViewDate((date) => new Date(date.getFullYear() + amount * 100, date.getMonth(), 1))
  }

  function chooseYear(nextYear: number) {
    pendingFocusControl.current = `[data-month="${viewDate.getMonth()}"]`
    setViewDate((date) => new Date(nextYear, date.getMonth(), 1))
    setView('months')
  }

  function chooseMonth(month: number) {
    const year = viewDate.getFullYear()
    const day = Math.min(selectedDate?.date.getDate() ?? 1, new Date(year, month + 1, 0).getDate())
    const dayToFocus = new Date(year, month, day)
    pendingFocusDate.current = dateKey(dayToFocus)
    setViewDate(dayToFocus)
    setView('days')
  }

  function chooseDecade(startYear: number) {
    pendingFocusControl.current = `[data-year="${startYear}"]`
    setViewDate((date) => new Date(startYear, date.getMonth(), 1))
    setView('years')
  }

  function handleDayKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, date: Date) {
    let nextDate: Date | null = null
    if (event.key === 'ArrowLeft') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    if (event.key === 'ArrowRight') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    if (event.key === 'ArrowUp') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    if (event.key === 'ArrowDown') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
    const weekdayOffset = (date.getDay() - firstWeekday + 7) % 7
    if (event.key === 'Home') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekdayOffset)
    if (event.key === 'End') nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - weekdayOffset))
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      const offset = (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1)
      const targetMonth = new Date(date.getFullYear(), date.getMonth() + offset, 1)
      const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate()
      nextDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(date.getDate(), lastDay))
    }
    if (!nextDate) return
    event.preventDefault()
    pendingFocusDate.current = dateKey(nextDate)
    setViewDate(nextDate)
  }

  return (
    <div
      className="themed-date-picker"
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <label className="themed-date-picker-label" htmlFor={id}>{label}</label>
      <button
        id={id}
        type="button"
        className={`themed-date-picker-trigger${open ? ' is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => {
          if (open) {
            setOpen(false)
          } else {
            setView('days')
            setViewDate(selectedDate?.date ?? new Date())
            setOpen(true)
          }
        }}
      >
        <span className="themed-date-picker-value">{displayValue}</span>
        <CalendarDays size={18} aria-hidden="true" />
      </button>
      {open && (
        <section id={dialogId} className="themed-calendar-popover" role="dialog" aria-label={`${label} calendar`}>
          <div className={`themed-calendar-header is-${view}`}>
            {view === 'days' ? (
              <>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month"><ChevronLeft size={18} aria-hidden="true" /></button>
                <div className="themed-calendar-heading-pickers">
                  <button type="button" onClick={() => { pendingFocusControl.current = `[data-month="${viewDate.getMonth()}"]`; setView('months') }} aria-label="Choose month">{monthNames[viewDate.getMonth()]}</button>
                  <button type="button" onClick={() => { pendingFocusControl.current = `[data-year="${year}"]`; setView('years') }} aria-label="Choose year">{year}</button>
                </div>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftMonth(1)} aria-label="Next month"><ChevronRight size={18} aria-hidden="true" /></button>
              </>
            ) : view === 'months' ? (
              <>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftYear(-1)} aria-label="Previous year"><ChevronLeft size={18} aria-hidden="true" /></button>
                <button type="button" className="themed-calendar-range" onClick={() => { pendingFocusControl.current = `[data-year="${year}"]`; setView('years') }} aria-label="Choose year">{year}</button>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftYear(1)} aria-label="Next year"><ChevronRight size={18} aria-hidden="true" /></button>
              </>
            ) : view === 'years' ? (
              <>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftDecade(-1)} aria-label="Previous decade"><ChevronLeft size={18} aria-hidden="true" /></button>
                <button type="button" className="themed-calendar-range" onClick={() => { pendingFocusControl.current = `[data-decade="${decadeStart}"]`; setView('decades') }} aria-label="Choose decade">{decadeStart}–{decadeStart + 9}</button>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftDecade(1)} aria-label="Next decade"><ChevronRight size={18} aria-hidden="true" /></button>
              </>
            ) : (
              <>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftCentury(-1)} aria-label="Previous century"><ChevronLeft size={18} aria-hidden="true" /></button>
                <h3 aria-live="polite">{centuryStart}–{centuryStart + 99}</h3>
                <button type="button" className="themed-calendar-nav" onClick={() => shiftCentury(1)} aria-label="Next century"><ChevronRight size={18} aria-hidden="true" /></button>
              </>
            )}
          </div>
          {view === 'days' ? (
            <div className="themed-calendar-grid">
              {weekdays.map((weekday) => <span className="themed-calendar-weekday" key={weekday}>{weekday}</span>)}
              {days.map((date, index) => date ? (
                <button
                  type="button"
                  key={dateKey(date)}
                  data-date={dateKey(date)}
                  className={`themed-calendar-day${selectedDate && dateKey(date) === dateKey(selectedDate.date) ? ' is-selected' : ''}${dateKey(date) === dateKey(new Date()) ? ' is-today' : ''}`}
                  aria-label={new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(date)}
                  aria-pressed={Boolean(selectedDate && dateKey(date) === dateKey(selectedDate.date))}
                  onClick={() => setSelectedDate(date)}
                  onKeyDown={(event) => handleDayKeyDown(event, date)}
                >
                  {date.getDate()}
                </button>
              ) : <span className="themed-calendar-empty" key={`empty-${index}`} aria-hidden="true" />)}
            </div>
          ) : view === 'months' ? (
            <div className="themed-calendar-choice-grid is-months" aria-label="Choose month">
              {monthNames.map((month, index) => <button type="button" key={month} data-month={index} className={viewDate.getMonth() === index ? 'is-current' : ''} onClick={() => chooseMonth(index)}>{month}</button>)}
            </div>
          ) : view === 'years' ? (
            <div className="themed-calendar-choice-grid" aria-label="Choose year">
              {yearChoices.map((choice) => <button type="button" key={choice} data-year={choice} className={`${choice === year ? 'is-current' : ''}${Math.floor(choice / 10) * 10 !== decadeStart ? ' is-adjacent' : ''}`} onClick={() => chooseYear(choice)}>{choice}</button>)}
            </div>
          ) : (
            <div className="themed-calendar-choice-grid" aria-label="Choose decade">
              {decadeChoices.map((choice) => <button type="button" key={choice} data-decade={choice} className={`${Math.floor(year / 10) * 10 === choice ? 'is-current' : ''}${Math.floor(choice / 100) * 100 !== centuryStart ? ' is-adjacent' : ''}`} onClick={() => chooseDecade(choice)}>{choice}s</button>)}
            </div>
          )}
          <div className="themed-calendar-time">
            <span className="themed-calendar-time-label">Time (24-hour)</span>
            <label><span>Hour</span><input aria-label="Hour" type="number" min="0" max="23" value={hour} onChange={(event) => changeTime(event.target.value, minute)} /></label>
            <span className="themed-calendar-time-separator" aria-hidden="true">:</span>
            <label><span>Minute</span><input aria-label="Minute" type="number" min="0" max="59" value={minute} onChange={(event) => changeTime(hour, event.target.value)} /></label>
          </div>
          <div className="themed-calendar-footer">
            <button type="button" className="themed-calendar-clear" onClick={() => onChange('')}>Clear</button>
            <button type="button" className="themed-calendar-today" onClick={() => setSelectedDate(new Date())}>Today</button>
            <button type="button" className="themed-calendar-done" onClick={() => { setOpen(false); rootRef.current?.querySelector<HTMLButtonElement>('.themed-date-picker-trigger')?.focus() }} disabled={!selectedDate}>Done</button>
          </div>
        </section>
      )}
    </div>
  )
}

export default ThemedDateTimePicker
