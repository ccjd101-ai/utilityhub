import { useState } from 'react'
import { ArrowLeftRight, GitCompareArrows, Trash2 } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import type { JsonDifference } from '../tools/jsonDiff'
import { diffJson, type JsonValue } from '../tools/jsonDiff'

type DocumentSide = 'left' | 'right'

function JsonDiffPage() {
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [differences, setDifferences] = useState<JsonDifference[] | null>(null)
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)

  function updateInput(side: DocumentSide, value: string) {
    if (side === 'left') setLeftInput(value)
    else setRightInput(value)

    if (differences !== null) {
      setDifferences(null)
      setMessage('Inputs changed. Compare again to refresh the results.')
      setHasError(false)
    }
  }

  function clearInput(side: DocumentSide) {
    updateInput(side, '')
    setMessage(`${side === 'left' ? 'Left' : 'Right'} input cleared.`)
    setHasError(false)
  }

  function replaceInput(target: DocumentSide, value: string) {
    updateInput(target, value)
    setMessage(`${target === 'left' ? 'Left' : 'Right'} input replaced.`)
    setHasError(false)
  }

  function compare() {
    let left: JsonValue
    let right: JsonValue

    try {
      if (!leftInput.trim()) throw new Error('Enter JSON in the left document.')
      left = JSON.parse(leftInput) as JsonValue
    } catch (error) {
      setDifferences(null)
      setHasError(true)
      setMessage(
        `Left document: ${error instanceof Error ? error.message : 'Invalid JSON.'}`,
      )
      return
    }

    try {
      if (!rightInput.trim()) throw new Error('Enter JSON in the right document.')
      right = JSON.parse(rightInput) as JsonValue
    } catch (error) {
      setDifferences(null)
      setHasError(true)
      setMessage(
        `Right document: ${error instanceof Error ? error.message : 'Invalid JSON.'}`,
      )
      return
    }

    const result = diffJson(left, right)
    setDifferences(result)
    setHasError(false)

    if (result.length === 0) {
      setMessage('No differences found. The JSON structures are equivalent.')
    } else {
      const added = result.filter((item) => item.kind === 'added').length
      const removed = result.filter((item) => item.kind === 'removed').length
      const changed = result.filter((item) => item.kind === 'changed').length
      setMessage(
        `Found ${result.length} difference${result.length === 1 ? '' : 's'}: ${added} added, ${removed} removed, ${changed} changed.`,
      )
    }
  }

  function renderValue(value: JsonValue | undefined) {
    return JSON.stringify(value, null, 2) ?? 'null'
  }

  return (
    <ToolLayout
      title="JSON Diff"
      description="Compare two JSON documents by structure, not formatting. Spot added, removed, and changed values right in your browser."
    >
      <div className="json-diff">
        <div className="json-diff-inputs">
          <div className="json-diff-document">
            <div className="json-diff-document-heading">
              <label htmlFor="json-diff-left">Original JSON</label>
              <button
                type="button"
                className="json-diff-text-action"
                onClick={() => clearInput('left')}
                disabled={!leftInput}
                aria-label="Clear original JSON"
              >
                <Trash2 size={14} aria-hidden="true" />
                Clear
              </button>
            </div>
            <textarea
              id="json-diff-left"
              value={leftInput}
              onChange={(event) => updateInput('left', event.target.value)}
              placeholder={'Paste the original JSON…\n{ "version": 1 }'}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-describedby="json-diff-left-hint"
            />
            <span id="json-diff-left-hint" className="json-diff-hint">
              Original document
            </span>
            <button
              type="button"
              className="json-diff-text-action json-diff-replace"
              onClick={() => replaceInput('right', leftInput)}
              disabled={!leftInput}
              aria-label="Replace updated JSON with original JSON"
            >
              <ArrowLeftRight size={14} aria-hidden="true" />
              Use as updated JSON
            </button>
          </div>

          <div className="json-diff-document">
            <div className="json-diff-document-heading">
              <label htmlFor="json-diff-right">Updated JSON</label>
              <button
                type="button"
                className="json-diff-text-action"
                onClick={() => clearInput('right')}
                disabled={!rightInput}
                aria-label="Clear updated JSON"
              >
                <Trash2 size={14} aria-hidden="true" />
                Clear
              </button>
            </div>
            <textarea
              id="json-diff-right"
              value={rightInput}
              onChange={(event) => updateInput('right', event.target.value)}
              placeholder={'Paste the updated JSON…\n{ "version": 2 }'}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-describedby="json-diff-right-hint"
            />
            <span id="json-diff-right-hint" className="json-diff-hint">
              Updated document
            </span>
            <button
              type="button"
              className="json-diff-text-action json-diff-replace"
              onClick={() => replaceInput('left', rightInput)}
              disabled={!rightInput}
              aria-label="Replace original JSON with updated JSON"
            >
              <ArrowLeftRight size={14} aria-hidden="true" />
              Use as original JSON
            </button>
          </div>
        </div>

        <div className="json-diff-actions">
          <ActionButton variant="primary" onClick={compare}>
            <GitCompareArrows size={16} aria-hidden="true" />
            Compare JSON
          </ActionButton>
        </div>

        <p
          className={`json-diff-status${hasError ? ' is-error' : ''}`}
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {message}
        </p>

        {differences !== null && (
          <section className="json-diff-results" aria-labelledby="json-diff-results-title">
            <div className="json-diff-results-heading">
              <h2 id="json-diff-results-title">Comparison results</h2>
              <span>{differences.length} differences</span>
            </div>

            {differences.length === 0 ? (
              <div className="json-diff-empty">
                <strong>These JSON documents are equivalent.</strong>
                <span>Differences in whitespace and object key order are ignored.</span>
              </div>
            ) : (
              <ol className="json-diff-list">
                {differences.map((difference, index) => (
                  <li
                    className={`json-diff-item is-${difference.kind}`}
                    key={`${difference.path}-${difference.kind}-${index}`}
                  >
                    <div className="json-diff-item-heading">
                      <span className="json-diff-kind">{difference.kind}</span>
                      <code>{difference.path}</code>
                    </div>
                    <div className="json-diff-values">
                      {difference.kind !== 'added' && (
                        <div className="json-diff-value json-diff-before">
                          <span>Before</span>
                          <pre>{renderValue(difference.before)}</pre>
                        </div>
                      )}
                      {difference.kind !== 'removed' && (
                        <div className="json-diff-value json-diff-after">
                          <span>After</span>
                          <pre>{renderValue(difference.after)}</pre>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </ToolLayout>
  )
}

export default JsonDiffPage
