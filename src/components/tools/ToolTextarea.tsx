interface ToolTextareaProps {
  id: string
  label: string
  value: string
  placeholder: string
  hint?: string
  readOnly?: boolean
  onChange?: (value: string) => void
}

function ToolTextarea({
  id,
  label,
  value,
  placeholder,
  hint,
  readOnly = false,
  onChange,
}: ToolTextareaProps) {
  const hintId = `${id}-hint`

  return (
    <div className="data-tool-editor">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && <span id={hintId} className="data-tool-hint">{hint}</span>}
    </div>
  )
}

export default ToolTextarea
