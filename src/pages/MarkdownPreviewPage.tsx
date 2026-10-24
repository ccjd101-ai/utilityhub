import { useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import ToolLayout from '../components/layout/ToolLayout'
import { renderMarkdown } from '../tools/markdownPreview'

const starterMarkdown = `# Markdown preview\n\nType on the left to see a live preview.\n\n- **Bold text**\n- *Italic text*\n- [A link](https://example.com)\n\n\`\`\`js\nconst ready = true\n\`\`\``

function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(starterMarkdown)
  const safeHtml = useMemo(
    () => DOMPurify.sanitize(renderMarkdown(markdown)),
    [markdown],
  )

  return (
    <ToolLayout title="Markdown Preview" description="Write Markdown and preview the rendered document side by side. Preview generation stays in your browser.">
      <div className="writing-tool">
        <p className="writing-tool-note">Rendered HTML is sanitized before display. Raw HTML in Markdown is not trusted.</p>
        <div className="markdown-workspace">
          <div className="writing-diff-editor">
            <label htmlFor="markdown-input">Markdown</label>
            <textarea id="markdown-input" value={markdown} onChange={(event) => setMarkdown(event.target.value)} placeholder="# Write Markdown…" spellCheck={false} />
          </div>
          <section className="markdown-preview" aria-label="Rendered Markdown preview">
            <h2>Preview</h2>
            {markdown.trim() ? (
              <div className="markdown-rendered" dangerouslySetInnerHTML={{ __html: safeHtml }} />
            ) : (
              <p className="markdown-empty">Your Markdown preview will appear here.</p>
            )}
          </section>
        </div>
      </div>
    </ToolLayout>
  )
}

export default MarkdownPreviewPage
