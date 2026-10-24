import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import ToolTextarea from '../components/tools/ToolTextarea'
import { countTextMetrics } from '../tools/textMetrics'

function TextCounterPage() {
  const [text, setText] = useState('')
  const metrics = countTextMetrics(text)

  return (
    <ToolLayout title="Word & Character Counter" description="Count words, visible characters, and lines as you type. Everything stays in your browser.">
      <div className="writing-tool">
        <ToolTextarea id="counter-text" label="Text to count" value={text} onChange={setText} placeholder="Type or paste your text here…" />
        <dl className="text-counter-metrics" aria-live="polite" aria-atomic="true">
          <div><dt>Words</dt><dd>{metrics.words.toLocaleString()}</dd></div>
          <div><dt>Characters</dt><dd>{metrics.characters.toLocaleString()}</dd></div>
          <div><dt>Characters without whitespace</dt><dd>{metrics.charactersWithoutWhitespace.toLocaleString()}</dd></div>
          <div><dt>Lines</dt><dd>{metrics.lines.toLocaleString()}</dd></div>
        </dl>
        <p className="writing-tool-note">Characters count visible graphemes, so a combined emoji counts as one character. A trailing newline counts as an additional line.</p>
      </div>
    </ToolLayout>
  )
}

export default TextCounterPage
