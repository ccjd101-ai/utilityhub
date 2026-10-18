import { useState } from 'react'
import {
  ArrowDownToLine,
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import CopyButton from '../components/ui/CopyButton'
import { useActionFeedback } from '../hooks/useActionFeedback'
import { useRecentResults } from '../hooks/useRecentResults'
import { tools } from '../tools/registry'

const MIN_COUNT = 1
const MAX_COUNT = 100
const DEFAULT_COUNT = 10

type GuidCase = 'lowercase' | 'uppercase'

interface GuidBatch {
  guids: string[]
  casing: GuidCase
  includeHyphens: boolean
  includeBraces: boolean
}

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

function formatBatchDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function GuidGeneratorPage() {
  const [count, setCount] = useState(String(DEFAULT_COUNT))
  const [casing, setCasing] = useState<GuidCase>('lowercase')
  const [includeHyphens, setIncludeHyphens] = useState(true)
  const [includeBraces, setIncludeBraces] = useState(false)
  const [guids, setGuids] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const {
    items: recentResults,
    add: addRecentResult,
    remove: removeRecentResult,
    clear: clearRecentResults,
  } = useRecentResults<GuidBatch>({
    storageKey: 'utilityhub:guid-generator:recent-results',
    maxItems: 10,
  })

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

      addRecentResult({
        guids: generated,
        casing,
        includeHyphens,
        includeBraces,
      })

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

  function restoreBatch(batch: GuidBatch) {
    setGuids(batch.guids)
    setCount(String(batch.guids.length))
    setCasing(batch.casing)
    setIncludeHyphens(batch.includeHyphens)
    setIncludeBraces(batch.includeBraces)
    setMessage(`${batch.guids.length} GUIDs restored from recent results.`)
  }

  async function copyBatch(batch: GuidBatch) {
    try {
      await navigator.clipboard.writeText(batch.guids.join('\n'))
      setMessage(`${batch.guids.length} historical GUIDs copied.`)
    } catch {
      setMessage('Unable to access the clipboard. Check browser permissions.')
    }
  }

  function downloadBatch(batch: GuidBatch, id: string) {
    try {
      const blob = new Blob([batch.guids.join('\n')], {
        type: 'text/plain;charset=utf-8',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `utilityhub-guids-${id}.txt`
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.setTimeout(() => URL.revokeObjectURL(url), 1000)

      setMessage(`${batch.guids.length} historical GUIDs downloaded.`)
    } catch {
      setMessage('Unable to download historical GUIDs.')
    }
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

        <section
          className="guid-history"
          aria-labelledby="guid-history-title"
        >
          <div className="guid-history-heading">
            <div>
              <h2 id="guid-history-title">Recent Results</h2>
              <p>Your latest generated batches, saved in this browser.</p>
            </div>

            {recentResults.length > 0 && (
              <button
                type="button"
                className="guid-history-clear"
                onClick={clearRecentResults}
              >
                <Trash2 size={14} aria-hidden="true" />
                Clear history
              </button>
            )}
          </div>

          {recentResults.length === 0 ? (
            <div className="guid-history-empty">
              <p>No recent batches yet.</p>
              <span>Generated batches will appear here.</span>
            </div>
          ) : (
            <ol className="guid-history-list">
              {recentResults.map((result) => {
                const batch = result.data

                return (
                  <li key={result.id} className="guid-history-item">
                    <div className="guid-history-info">
                      <strong>
                        {batch.guids.length}{' '}
                        {batch.guids.length === 1 ? 'GUID' : 'GUIDs'}
                      </strong>

                      <span>{formatBatchDate(result.createdAt)}</span>

                      <span>
                        {batch.casing === 'uppercase'
                          ? 'Uppercase'
                          : 'Lowercase'}
                        {' · '}
                        {batch.includeHyphens ? 'Hyphens' : 'No hyphens'}
                        {' · '}
                        {batch.includeBraces ? 'Braces' : 'No braces'}
                      </span>
                    </div>

                    <div className="guid-history-actions">
                      <button
                        type="button"
                        onClick={() => restoreBatch(batch)}
                        aria-label={`Restore ${batch.guids.length} GUIDs`}
                      >
                        <RefreshCw size={15} aria-hidden="true" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void copyBatch(batch)}
                        aria-label={`Copy ${batch.guids.length} GUIDs`}
                      >
                        <Copy size={15} aria-hidden="true" />
                        <span>Copy</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadBatch(batch, result.id)}
                        aria-label={`Download ${batch.guids.length} GUIDs`}
                      >
                        <ArrowDownToLine size={15} aria-hidden="true" />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeRecentResult(result.id)}
                        aria-label={`Delete batch generated ${formatBatchDate(result.createdAt)}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        <section
          className="guid-related"
          aria-labelledby="guid-related-title"
        >
          <h2 id="guid-related-title">Related Tools</h2>
          <p>More utilities for your development workflow.</p>

          <div className="guid-related-grid">
            {tools
              .filter(
                (tool) =>
                  tool.category === 'DEVELOPERS' &&
                  tool.href !== '/tools/guid-generator',
              )
              .map((tool) => {
                const Icon = tool.icon

                return (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="guid-related-card"
                  >
                    <Icon size={20} aria-hidden="true" />

                    <span>
                      <strong>{tool.title}</strong>
                      <small>Coming soon</small>
                    </span>

                    <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                )
              })}
          </div>
        </section>

        <p className="guid-status" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </ToolLayout>
  )
}

export default GuidGeneratorPage