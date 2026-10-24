import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { findRegexMatches } from '../tools/regexTester'
import type { RegexMatch } from '../tools/regexTester'

function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('')
  const [input, setInput] = useState('')
  const [matches, setMatches] = useState<RegexMatch[] | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  function test() {
    try {
      const result = findRegexMatches(pattern, flags, input)
      setMatches(result)
      setError(false)
      setMessage(result.length ? `${result.length} match${result.length === 1 ? '' : 'es'} found (up to 500 shown).` : 'No matches found.')
    } catch (reason) {
      setMatches(null)
      setError(true)
      setMessage(reason instanceof Error ? reason.message : 'Unable to run this regular expression.')
    }
  }

  function clear() {
    setPattern('')
    setFlags('')
    setInput('')
    setMatches(null)
    setError(false)
    setMessage('Pattern and test text cleared.')
  }

  return (
    <ToolLayout title="Regex Tester" description="Test JavaScript regular expressions against sample text and inspect matches and capture groups.">
      <div className="data-tool">
        <div className="regex-controls">
          <div className="data-tool-field">
            <label htmlFor="regex-pattern">Regular expression</label>
            <input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="e.g. (\\w+)@(\\w+\\.com)" spellCheck={false} autoCapitalize="off" autoCorrect="off" />
          </div>
          <div className="data-tool-field regex-flags">
            <label htmlFor="regex-flags">Flags</label>
            <input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} placeholder="gimsuy" spellCheck={false} autoCapitalize="off" autoCorrect="off" />
          </div>
        </div>
        <div className="data-tool-single-editor">
          <label htmlFor="regex-test-input">Test text</label>
          <textarea id="regex-test-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter text to test against…" spellCheck={false} />
        </div>
        <p className="data-tool-note">Uses JavaScript regular-expression syntax. Patterns run in your browser; pathological expressions may take a long time to evaluate. Results are capped at 500 matches.</p>
        <div className="data-tool-actions">
          <ActionButton variant="primary" onClick={test}>Test expression</ActionButton>
          <ActionButton onClick={clear}><RotateCcw size={16} aria-hidden="true" />Clear</ActionButton>
        </div>
        <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
        {matches !== null && matches.length > 0 && (
          <section className="regex-results" aria-labelledby="regex-results-title">
            <h2 id="regex-results-title">Matches</h2>
            <ol>
              {matches.map((match, index) => (
                <li key={`${match.index}-${index}`}>
                  <span>Match {index + 1} · index {match.index}</span>
                  <code>{match.value || '(empty match)'}</code>
                  {match.groups.length > 0 && <small>Groups: {match.groups.map((group) => group || '(empty)').join(' · ')}</small>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </ToolLayout>
  )
}

export default RegexTesterPage
