import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  group?: string
}

interface ThemedSelectProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

function ThemedSelect({ id, label, value, options, onChange }: ThemedSelectProps) {
  const generatedId = useId()
  const listboxId = `${generatedId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)))
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, listboxId, open])

  function openList() {
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)))
    setOpen(true)
  }

  function selectOption(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        openList()
        return
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + options.length) % options.length)
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      selectOption(activeIndex)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div
      className="themed-select"
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <label className="themed-select-label" htmlFor={id}>{label}</label>
      <button
        id={id}
        type="button"
        className="themed-select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-option-${activeIndex}` : undefined}
        onClick={() => open ? setOpen(false) : openList()}
        onKeyDown={handleKeyDown}
      >
        <span>{selected?.label ?? 'Choose an option'}</span>
        <ChevronDown size={17} aria-hidden="true" className={open ? 'is-open' : ''} />
      </button>
      {open && (
        <div id={listboxId} role="listbox" aria-label={label} className="themed-select-menu">
          {options.map((option, index) => (
            <div className="themed-select-option-group" key={option.value}>
              {option.group && (index === 0 || options[index - 1]?.group !== option.group)
                && <span className="themed-select-group-label">{option.group}</span>}
              <button
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={option.value === value}
                className={`themed-select-option${index === activeIndex ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
              >
                <span>{option.label}</span>
                {option.value === value && <span className="themed-select-check" aria-hidden="true">✓</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemedSelect
