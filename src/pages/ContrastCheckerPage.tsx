import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import { contrastRatio, parseHexColor } from '../tools/color'

function ContrastCheckerPage() {
  const [foreground, setForeground] = useState('#111827')
  const [background, setBackground] = useState('#ffffff')
  let ratio: number | null = null
  try { ratio = contrastRatio(parseHexColor(foreground), parseHexColor(background)) } catch { /* Show validation feedback. */ }
  const normalPass = ratio !== null && ratio >= 4.5
  const largePass = ratio !== null && ratio >= 3

  return <ToolLayout title="Color Contrast Checker" description="Check foreground/background contrast against WCAG AA thresholds. Results are calculated locally in your browser.">
    <div className="data-tool color-tool">
      <div className="contrast-controls">
        <label htmlFor="contrast-foreground">Text color (HEX)<input id="contrast-foreground" value={foreground} onChange={(event) => setForeground(event.target.value)} aria-invalid={!(() => { try { parseHexColor(foreground); return true } catch { return false } })()} spellCheck={false} /></label>
        <label htmlFor="contrast-background">Background color (HEX)<input id="contrast-background" value={background} onChange={(event) => setBackground(event.target.value)} aria-invalid={!(() => { try { parseHexColor(background); return true } catch { return false } })()} spellCheck={false} /></label>
      </div>
      {ratio === null ? <p className="data-tool-status is-error" role="alert">Enter valid 3- or 6-digit HEX colors for both fields.</p> : <>
        <div className="contrast-preview" style={{ color: foreground, backgroundColor: background }}><strong>Sample text preview</strong><span>Accessible color makes content easier to read.</span></div>
        <div className="contrast-result" aria-live="polite"><strong>{ratio.toFixed(2)}:1</strong><span>Contrast ratio</span></div>
        <div className="contrast-badges" aria-label="WCAG AA results">
          <span className={normalPass ? 'is-pass' : 'is-fail'}>Normal text: {normalPass ? 'Pass' : 'Fail'} (4.5:1)</span>
          <span className={largePass ? 'is-pass' : 'is-fail'}>Large text: {largePass ? 'Pass' : 'Fail'} (3:1)</span>
        </div>
        <p className="data-tool-status">WCAG AA thresholds shown; large text is at least 18pt (24px) or 14pt bold (about 18.7px).</p>
      </>}
    </div>
  </ToolLayout>
}

export default ContrastCheckerPage
