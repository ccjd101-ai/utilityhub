import { useState } from 'react'
import { Copy, WandSparkles, X } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'
import ActionButton from '../components/ui/ActionButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { formatText, type TextCase } from '../tools/textFormatter'

function TextFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [casing, setCasing] = useState<TextCase>('unchanged')
  const [trimWhitespace, setTrimWhitespace] = useState(false)
  const [collapseSpaces, setCollapseSpaces] = useState(false)
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)
  const copyFeedback = useActionFeedback()

  function runFormat() {
    setOutput(formatText(input, { casing, trimWhitespace, collapseSpaces }))
    setHasError(false)
    setMessage('Text formatted.')
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
      title="Text Formatter"
      description="Clean up and transform text in a few clicks. Your text is processed entirely in your browser."
    >
      <div className="text-formatter">
        <div className="text-formatter-options">
          <div className="text-formatter-field">
            <ThemedSelect
              id="text-casing"
              label="Letter case"
              value={casing}
              onChange={(value) => setCasing(value as TextCase)}
              options={[
                { group: 'Basic casing', value: 'unchanged', label: 'Keep as entered' },
                { group: 'Basic casing', value: 'uppercase', label: 'UPPERCASE' },
                { group: 'Basic casing', value: 'lowercase', label: 'lowercase' },
                { group: 'Basic casing', value: 'title', label: 'Title Case' },
                { group: 'Basic casing', value: 'sentence', label: 'Sentence case' },
                { group: 'Developer casing', value: 'camel', label: 'camelCase' },
                { group: 'Developer casing', value: 'pascal', label: 'PascalCase' },
                { group: 'Developer casing', value: 'snake', label: 'snake_case' },
                { group: 'Developer casing', value: 'constant', label: 'CONSTANT_CASE' },
                { group: 'Developer casing', value: 'kebab', label: 'kebab-case' },
                { group: 'Developer casing', value: 'screaming-kebab', label: 'SCREAMING-KEBAB-CASE' },
                { group: 'Developer casing', value: 'train', label: 'Train-Case' },
                { group: 'Developer casing', value: 'dot', label: 'dot.case' },
              ]}
            />
          </div>

          <fieldset className="text-formatter-toggles">
            <legend>Cleanup options</legend>
            <label>
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(event) => setTrimWhitespace(event.target.checked)}
              />
              Trim leading and trailing whitespace
            </label>
            <label>
              <input
                type="checkbox"
                checked={collapseSpaces}
                onChange={(event) => setCollapseSpaces(event.target.checked)}
              />
              Replace repeated spaces with one space
            </label>
          </fieldset>
        </div>

        <div className="text-formatter-editors">
          <div className="text-formatter-editor">
            <label htmlFor="text-input">Input text</label>
            <textarea
              id="text-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type or paste text here…"
              spellCheck={false}
              aria-describedby="text-input-hint"
            />
            <span id="text-input-hint" className="text-formatter-hint">
              {input.length} characters
            </span>
          </div>

          <div className="text-formatter-editor">
            <label htmlFor="text-output">Result</label>
            <textarea
              id="text-output"
              value={output}
              readOnly
              placeholder="Your formatted text will appear here."
              spellCheck={false}
              aria-describedby="text-output-hint"
            />
            <span id="text-output-hint" className="text-formatter-hint">
              {output.length} characters
            </span>
          </div>
        </div>

        <div className="text-formatter-actions">
          <ActionButton variant="primary" onClick={runFormat}>
            <WandSparkles size={16} aria-hidden="true" />
            Format text
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
            <X size={16} aria-hidden="true" />
            Clear
          </ActionButton>
        </div>

        <p
          className={`text-formatter-status${hasError ? ' is-error' : ''}`}
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

export default TextFormatterPage
