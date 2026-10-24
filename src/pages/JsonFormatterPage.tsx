import { useState } from 'react'
import { AlignLeft, Copy, Minimize2, Trash2 } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'
import ActionButton from '../components/ui/ActionButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { transformJson, type JsonIndentation } from '../tools/jsonFormatter'

type TransformMode = 'format' | 'minify'

function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentation, setIndentation] = useState<JsonIndentation>(2)
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)
  const copyFeedback = useActionFeedback()

  function runTransform(mode: TransformMode) {
    try {
      const transformed = transformJson(input, mode, indentation)
      setOutput(transformed)
      setHasError(false)
      setMessage(
        mode === 'format'
          ? `JSON formatted with ${indentation}-space indentation.`
          : 'JSON minified.',
      )
    } catch (error) {
      setOutput('')
      setHasError(true)
      setMessage(
        error instanceof Error ? error.message : 'Unable to parse this JSON.',
      )
    }
  }

  async function copyOutput() {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setHasError(false)
      setMessage('Result copied to clipboard.')
      copyFeedback.showSuccess()
    } catch {
      setHasError(true)
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function clearFields() {
    setInput('')
    setOutput('')
    setHasError(false)
    setMessage('Input and result cleared.')
    copyFeedback.reset()
  }

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Validate, format, and minify JSON directly in your browser. Your data stays on this device."
    >
      <div className="json-formatter">
        <div className="json-formatter-toolbar">
          <div className="json-formatter-indent">
            <ThemedSelect
              id="json-indentation"
              label="Indentation"
              value={String(indentation)}
              onChange={(value) => setIndentation(Number(value) as JsonIndentation)}
              options={[
                { value: '2', label: '2 spaces' },
                { value: '4', label: '4 spaces' },
              ]}
            />
          </div>
          <span className="json-formatter-privacy">
            Processing stays in your browser
          </span>
        </div>

        <div className="json-formatter-editors">
          <div className="json-formatter-editor">
            <label htmlFor="json-input">Input JSON</label>
            <textarea
              id="json-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={'Paste or type JSON here…\n{ "hello": "world" }'}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-describedby="json-input-hint"
            />
            <span id="json-input-hint" className="json-formatter-hint">
              Objects, arrays, and JSON primitive values are supported.
            </span>
          </div>

          <div className="json-formatter-editor">
            <label htmlFor="json-output">Result</label>
            <textarea
              id="json-output"
              value={output}
              readOnly
              placeholder="Your formatted result will appear here."
              spellCheck={false}
              aria-describedby="json-result-hint"
            />
            <span id="json-result-hint" className="json-formatter-hint">
              The result is read-only. Copy it or edit the input to try again.
            </span>
          </div>
        </div>

        <div className="json-formatter-actions">
          <ActionButton
            variant="primary"
            onClick={() => runTransform('format')}
          >
            <AlignLeft size={16} aria-hidden="true" />
            Format JSON
          </ActionButton>
          <ActionButton onClick={() => runTransform('minify')}>
            <Minimize2 size={16} aria-hidden="true" />
            Minify
          </ActionButton>
          <ActionButton
            onClick={() => void copyOutput()}
            disabled={!output}
            feedbackState={copyFeedback.state}
            successLabel="Copied!"
            errorLabel="Copy failed"
          >
            <Copy size={16} aria-hidden="true" />
            Copy result
          </ActionButton>
          <ActionButton onClick={clearFields}>
            <Trash2 size={16} aria-hidden="true" />
            Clear
          </ActionButton>
        </div>

        <p
          className={`json-formatter-status${hasError ? ' is-error' : ''}`}
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {message}
        </p>
      </div>
    </ToolLayout>
  )
}

export default JsonFormatterPage
