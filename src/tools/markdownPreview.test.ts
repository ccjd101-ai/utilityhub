import { describe, expect, it } from 'vitest'
import { renderMarkdown } from './markdownPreview'

describe('renderMarkdown', () => {
  it('renders common Markdown structures', () => {
    const html = renderMarkdown('# Hello\n\n**world** and [UtilityHub](https://example.com)')
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<strong>world</strong>')
    expect(html).toContain('href="https://example.com"')
  })

  it('renders an empty document as an empty preview', () => {
    expect(renderMarkdown('')).toBe('')
  })
})
