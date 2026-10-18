import { useState } from 'react'
import { Download, RefreshCw, Trash2 } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import CopyButton from '../components/ui/CopyButton'
import { useActionFeedback } from '../hooks/useActionFeedback'

const MIN_COUNT = 1
const MAX_COUNT = 100
const DEFAULT_COUNT = 10

type GuidCase = 'lowercase' | 'uppercase'

function createGuid(
  casing: GuidCase,
  includeHyphens: boolean,
  includeBraces: boolean,
): string {
  let guid: string = crypto.randomUUID()

  if (!includeHyphens) {
    guid = guid.replaceAll('-', '')
  }

  if (casing === 'uppercase') {
    guid = guid.toUpperCase()
  }

  if (includeBraces) {
    guid = `{${guid}}`
  }

  return guid
}

function GuidGeneratorPage() {
  const [count, setCount] = useState(String(DEFAULT_COUNT))
  const [casing, setCasing] = useState<GuidCase>('lowercase')
  const [includeHyphens, setIncludeHyphens] = useState(true)
  const [includeBraces, setIncludeBraces] = useState(false)
  const [guids, setGuids] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const generateFeedback = useActionFeedback()
  const copyFeedback = useActionFeedback()
  const downloadFeedback = useActionFeedback()
  const clearFeedback = useActionFeedback()

  function generateGuids() {
    const parsedCount = Number(count)

    if (
      !Number.isInteger(parsedCount) ||
      parsedCount < MIN_COUNT ||
      parsedCount > MAX_COUNT
    ) {
      setMessage(`Enter a whole number between ${MIN_COUNT} and ${MAX_COUNT}.`)
      generateFeedback.showError()
      return
    }

    try {
      const generated = Array.from(
        { length: parsedCount },
        () => createGuid(casing, includeHyphens, includeBraces),
      )

      setGuids(generated)
      setMessage(
        `${generated.length} GUID${generated.length === 1 ? '' : 's'} generated.`,
      )
      generateFeedback.showSuccess()
    } catch {
      setMessage('GUID generation is unavailable in this browser context.')
      generateFeedback.showError()
    }
  }

  async function copyAllGuids() {
    if (guids.length === 0) return

    try {
      await navigator.clipboard.writeText(guids.join('\n'))
      setMessage('All GUIDs copied.')
      copyFeedback.showSuccess()
    } catch {
      setMessage('Unable to access the clipboard. Check browser permissions.')
      copyFeedback.showError()
    }
  }

  function downloadGuids() {
    if (guids.length === 0) return

    try {
      const blob = new Blob([guids.join('\n')], {
        type: 'text/plain;charset=utf-8',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = 'utilityhub-guids.txt'
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Allow the browser to start the download before releasing the URL.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)

      setMessage(`${guids.length} GUIDs downloaded.`)
      downloadFeedback.showSuccess()
    } catch {
      setMessage('Unable to download GUIDs.')
      downloadFeedback.showError()
    }
  }

  function clearResults() {
    setGuids([])
    setMessage('Results cleared.')
    clearFeedback.showSuccess()
  }

  return (
    <ToolLayout
      title="GUID Generator"
      description="Generate unique identifiers for your applications, databases, and development workflows."
    >
      <div className="guid-generator">
        <div className="guid-controls">
          <div className="guid-field">
            <label htmlFor="guid-count">Number of GUIDs</label>
            <input
              id="guid-count"
              type="number"
              min={MIN_COUNT}
              max={MAX_COUNT}
              step={1}
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
            <span className="guid-field-hint">
              Generate between 1 and 100.
            </span>
          </div>

          <div className="guid-field">
            <label htmlFor="guid-case">Letter casing</label>
            <select
              id="guid-case"
              value={casing}
              onChange={(event) => setCasing(event.target.value as GuidCase)}
            >
              <option value="lowercase">Lowercase</option>
              <option value="uppercase">Uppercase</option>
            </select>
          </div>

          <fieldset className="guid-options">
            <legend>Formatting</legend>

            <label>
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={(event) => setIncludeHyphens(event.target.checked)}
              />
              Include hyphens
            </label>

            <label>
              <input
                type="checkbox"
                checked={includeBraces}
                onChange={(event) => setIncludeBraces(event.target.checked)}
              />
              Wrap in braces
            </label>
          </fieldset>
        </div>

        <div className="guid-actions">
          <ActionButton
            variant="primary"
            onClick={generateGuids}
            feedbackState={generateFeedback.state}
            successLabel="Generated!"
            errorLabel="Check input"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Generate GUIDs
          </ActionButton>

          <ActionButton
            onClick={() => void copyAllGuids()}
            disabled={guids.length === 0}
            feedbackState={copyFeedback.state}
            successLabel="Copied!"
            errorLabel="Copy failed"
          >
            Copy All
          </ActionButton>

          <ActionButton
            onClick={downloadGuids}
            disabled={guids.length === 0}
            feedbackState={downloadFeedback.state}
            successLabel="Downloaded!"
            errorLabel="Download failed"
          >
            <Download size={16} aria-hidden="true" />
            Download
          </ActionButton>

          <ActionButton
            onClick={clearResults}
            disabled={guids.length === 0}
            feedbackState={clearFeedback.state}
            successLabel="Cleared!"
          >
            <Trash2 size={16} aria-hidden="true" />
            Clear
          </ActionButton>
        </div>

        <div className="guid-results">
          <div className="guid-results-heading">
            <h2>Results</h2>
            <span>{guids.length} generated</span>
          </div>

          {guids.length === 0 ? (
            <div className="guid-empty-state">
              <p>Your generated GUIDs will appear here.</p>
              <span>Choose your options and generate your first batch.</span>
            </div>
          ) : (
            <ol className="guid-results-list">
              {guids.map((guid, index) => (
                <li key={`${guid}-${index}`}>
                  <span className="guid-result-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <code>{guid}</code>

                  <CopyButton
                    value={guid}
                    label={`Copy GUID ${index + 1}`}
                    className="guid-copy-button"
                  />
                </li>
              ))}
            </ol>
          )}
        </div>

        <p className="guid-status" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </ToolLayout>
  )
}

export default GuidGeneratorPage