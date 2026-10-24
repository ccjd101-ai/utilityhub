import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'
import { calculatePercentage, type PercentageMode } from '../tools/calculators'

function PercentageCalculatorPage() {
  const [mode, setMode] = useState<PercentageMode>('of')
  const [first, setFirst] = useState('15')
  const [second, setSecond] = useState('80')
  const firstLabel = mode === 'of' ? 'Percentage' : mode === 'what-percent' ? 'Part' : 'Starting value'
  const secondLabel = mode === 'of' ? 'Value' : mode === 'what-percent' ? 'Whole' : 'Ending value'
  let result: number | null = null
  let error = ''
  if (first !== '' && second !== '') {
    try { result = calculatePercentage(mode, Number(first), Number(second)) }
    catch (reason) { error = reason instanceof Error ? reason.message : 'Check the entered values.' }
  }

  return <ToolLayout title="Percentage Calculator" description="Calculate a percentage of a value, find what percent one number is of another, or calculate percentage change.">
    <div className="data-tool calculator-tool">
      <ThemedSelect id="percentage-mode" label="Calculation" value={mode} onChange={(value) => setMode(value as PercentageMode)} options={[
        { value: 'of', label: 'What is X% of Y?' },
        { value: 'what-percent', label: 'X is what percent of Y?' },
        { value: 'change', label: 'Percentage change from X to Y' },
      ]} />
      <div className="calculator-fields">
        <label htmlFor="percentage-first">{firstLabel}<input id="percentage-first" type="number" step="any" value={first} onChange={(event) => setFirst(event.target.value)} /></label>
        <label htmlFor="percentage-second">{secondLabel}<input id="percentage-second" type="number" step="any" value={second} onChange={(event) => setSecond(event.target.value)} /></label>
      </div>
      {result !== null && !error ? <div className="calculator-result" aria-live="polite"><span>Result</span><strong>{mode === 'what-percent' || mode === 'change' ? `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })}%` : result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</strong></div> : <p className="data-tool-status is-error" role="alert">{error || 'Enter both values to see the result.'}</p>}
      {mode === 'change' && <p className="data-tool-status">A negative result means the value decreased; a positive result means it increased.</p>}
    </div>
  </ToolLayout>
}

export default PercentageCalculatorPage
