import { useState } from 'react'
import { ArrowLeftRight, Trash2 } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { compareText, type TextDiffPart } from '../tools/plainTextDiff'

function PlainTextDiffPage() {
  const [original, setOriginal] = useState('')
  const [updated, setUpdated] = useState('')
  const [parts, setParts] = useState<TextDiffPart[] | null>(null)
  const [message, setMessage] = useState('')

  function compare() {
    setParts(compareText(original, updated))
    setMessage(original === updated ? 'The text is identical.' : 'Text comparison complete.')
  }

  function clear(side: 'original' | 'updated') {
    if (side === 'original') setOriginal('')
    else setUpdated('')
    setParts(null)
    setMessage(`${side === 'original' ? 'Original' : 'Updated'} text cleared.`)
  }

  function replace(side: 'original' | 'updated', value: string) {
    if (side === 'original') setOriginal(value)
    else setUpdated(value)
    setParts(null)
    setMessage('Text changed. Compare again to refresh the diff.')
  }

  return (
    <ToolLayout title="Plain Text Diff" description="Compare two text passages line by line and spot additions and removals.">
      <div className="writing-tool">
        <div className="writing-diff-inputs">
          <div className="writing-diff-editor">
            <div className="writing-diff-label-row">
              <label htmlFor="text-diff-original">Original text</label>
              <button type="button" className="writing-text-action" onClick={() => clear('original')} disabled={!original} aria-label="Clear original text"><Trash2 size={14} aria-hidden="true" />Clear</button>
            </div>
            <textarea id="text-diff-original" value={original} onChange={(event) => replace('original', event.target.value)} placeholder="Paste the original text…" spellCheck={false} />
            <button type="button" className="writing-text-action" onClick={() => replace('updated', original)} disabled={!original} aria-label="Replace updated text with original text"><ArrowLeftRight size={14} aria-hidden="true" />Use as updated text</button>
          </div>
          <div className="writing-diff-editor">
            <div className="writing-diff-label-row">
              <label htmlFor="text-diff-updated">Updated text</label>
              <button type="button" className="writing-text-action" onClick={() => clear('updated')} disabled={!updated} aria-label="Clear updated text"><Trash2 size={14} aria-hidden="true" />Clear</button>
            </div>
            <textarea id="text-diff-updated" value={updated} onChange={(event) => replace('updated', event.target.value)} placeholder="Paste the updated text…" spellCheck={false} />
            <button type="button" className="writing-text-action" onClick={() => replace('original', updated)} disabled={!updated} aria-label="Replace original text with updated text"><ArrowLeftRight size={14} aria-hidden="true" />Use as original text</button>
          </div>
        </div>
        <div className="writing-tool-actions">
          <ActionButton variant="primary" onClick={compare}>Compare text</ActionButton>
        </div>
        <p className="writing-tool-status" role="status" aria-live="polite">{message}</p>
        {parts && (
          <section className="writing-diff-results" aria-labelledby="text-diff-results-title">
            <div className="writing-diff-heading">
              <h2 id="text-diff-results-title">Diff result</h2>
              <div className="writing-diff-legend"><span className="is-added">Added</span><span className="is-removed">Removed</span></div>
            </div>
            <pre aria-label="Line-by-line text differences">{parts.map((part, index) => <span className={`writing-diff-part is-${part.kind}`} key={`${part.kind}-${index}`}>{part.value}</span>)}</pre>
          </section>
        )}
      </div>
    </ToolLayout>
  )
}

export default PlainTextDiffPage
