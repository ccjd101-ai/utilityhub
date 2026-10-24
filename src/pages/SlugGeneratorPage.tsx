import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { createSlug, type SlugSeparator } from '../tools/slug'

function SlugGeneratorPage() {
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState<SlugSeparator>('-')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const copyFeedback = useActionFeedback()
  const slug = createSlug(input, separator)

  async function copy() {
    if (!slug) return
    try {
      await navigator.clipboard.writeText(slug)
      setError(false)
      setMessage('Slug copied to clipboard.')
      copyFeedback.showSuccess()
    } catch {
      setError(true)
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function clear() {
    setInput('')
    setError(false)
    setMessage('Text cleared.')
    copyFeedback.reset()
  }

  return (
    <ToolLayout title="Slug Generator" description="Turn a title or phrase into a clean, URL-friendly slug, right in your browser.">
      <div className="writing-tool">
        <div className="data-tool-field slug-separator">
          <label htmlFor="slug-separator">Word separator</label>
          <select id="slug-separator" value={separator} onChange={(event) => setSeparator(event.target.value as SlugSeparator)}>
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>
        <div className="writing-diff-editor">
          <label htmlFor="slug-input">Title or phrase</label>
          <textarea id="slug-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="e.g. Café & Tea: A Beginner's Guide" />
        </div>
        <div className="slug-result" aria-labelledby="slug-result-label">
          <span id="slug-result-label">Generated slug</span>
          <code>{slug || 'Your slug will appear here.'}</code>
        </div>
        <div className="writing-tool-actions">
          <ActionButton variant="primary" onClick={() => void copy()} disabled={!slug} feedbackState={copyFeedback.state} successLabel="Copied!" errorLabel="Copy failed"><Copy size={16} aria-hidden="true" />Copy slug</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`writing-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      </div>
    </ToolLayout>
  )
}

export default SlugGeneratorPage
