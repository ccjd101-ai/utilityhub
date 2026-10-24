import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { parseHexColor, rgbToHsl } from '../tools/color'

function ColorConverterPage() {
  const [hex, setHex] = useState('#42e6a4')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const feedback = useActionFeedback()
  let color: ReturnType<typeof parseHexColor> | null = null
  try { color = parseHexColor(hex) } catch { /* Inline validation below. */ }
  const hsl = color ? rgbToHsl(color) : null
  const normalizedHex = color ? `#${[color.r, color.g, color.b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}` : ''

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setError(false); setMessage(`${value} copied to clipboard.`); feedback.showSuccess()
    } catch {
      setError(true); setMessage('Clipboard access failed. Check browser permissions.'); feedback.showError()
    }
  }

  return <ToolLayout title="Color Picker & Converter" description="Choose a color and convert between HEX, RGB, and HSL formats. Color processing stays in your browser.">
    <div className="data-tool color-tool">
      <div className="color-picker-panel">
        <label className="color-swatch-control" htmlFor="color-picker-input">
          <span className="color-preview" style={{ backgroundColor: color ? normalizedHex : 'transparent' }} />
          <span>Choose a color</span>
          <input id="color-picker-input" type="color" value={normalizedHex || '#000000'} onChange={(event) => { setHex(event.target.value); setMessage(''); setError(false) }} aria-label="Choose color using color picker" />
        </label>
        <label className="color-hex-field" htmlFor="color-hex-input">HEX value
          <input id="color-hex-input" type="text" value={hex} onChange={(event) => { setHex(event.target.value); setMessage(''); setError(false) }} aria-describedby="color-hex-hint" aria-invalid={!color} spellCheck={false} />
        </label>
        <p id="color-hex-hint" className={`data-tool-status${!color ? ' is-error' : ''}`} role={!color ? 'alert' : undefined}>{!color ? 'Enter a valid 3- or 6-digit HEX color.' : 'Use a 3- or 6-digit HEX value.'}</p>
      </div>
      {color && hsl && <div className="color-values" aria-label="Converted color values">
        {[
          ['HEX', normalizedHex.toUpperCase()],
          ['RGB', `rgb(${color.r}, ${color.g}, ${color.b})`],
          ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
        ].map(([label, value]) => <div className="color-value" key={label}><span>{label}</span><code>{value}</code><ActionButton onClick={() => void copy(value)} aria-label={`Copy ${label} value`}><Copy size={15} aria-hidden="true" />Copy</ActionButton></div>)}
      </div>}
      <div className="data-tool-actions"><ActionButton onClick={() => { setHex('#42e6a4'); setMessage('Color reset.'); setError(false); feedback.reset() }}><RotateCcw size={16} aria-hidden="true" />Reset</ActionButton></div>
      <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
    </div>
  </ToolLayout>
}

export default ColorConverterPage
