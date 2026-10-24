import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import { calculateTip } from '../tools/calculators'

function TipCalculatorPage() {
  const [bill, setBill] = useState('50')
  const [tipPercent, setTipPercent] = useState('18')
  const [people, setPeople] = useState('1')
  let result: ReturnType<typeof calculateTip> | null = null
  let error = ''
  if (bill !== '' && tipPercent !== '' && people !== '') {
    try { result = calculateTip(Number(bill), Number(tipPercent), Number(people)) }
    catch (reason) { error = reason instanceof Error ? reason.message : 'Check the entered values.' }
  }
  const money = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)

  return <ToolLayout title="Tip Calculator" description="Estimate a tip and split the total fairly between people. Change the tip or bill to see results instantly.">
    <div className="data-tool calculator-tool">
      <div className="calculator-fields calculator-fields-three">
        <label htmlFor="tip-bill">Bill amount<input id="tip-bill" type="number" min="0" step="0.01" value={bill} onChange={(event) => setBill(event.target.value)} /></label>
        <label htmlFor="tip-percent">Tip percentage<input id="tip-percent" type="number" min="0" step="any" value={tipPercent} onChange={(event) => setTipPercent(event.target.value)} /></label>
        <label htmlFor="tip-people">Split between<input id="tip-people" type="number" min="1" step="1" value={people} onChange={(event) => setPeople(event.target.value)} /></label>
      </div>
      {result ? <div className="tip-results" aria-live="polite">
        <div><span>Tip</span><strong>{money(result.tip)}</strong><small>{money(result.tipPerPerson)} per person</small></div>
        <div><span>Total with tip</span><strong>{money(result.total)}</strong><small>{money(result.totalPerPerson)} per person</small></div>
      </div> : <p className="data-tool-status is-error" role="alert">{error || 'Enter the bill, tip, and number of people.'}</p>}
      <p className="data-tool-status">Currency display uses USD. This is an estimate; adjust for your local currency as needed.</p>
    </div>
  </ToolLayout>
}

export default TipCalculatorPage
