import { useState } from 'react'
import ToolLayout from '../components/layout/ToolLayout'
import ThemedSelect from '../components/tools/ThemedSelect'
import { convertUnits, unitDefinitions, type UnitCategory } from '../tools/calculators'

const categoryLabels: Record<UnitCategory, string> = { length: 'Length', weight: 'Weight', volume: 'Volume', temperature: 'Temperature' }

function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('km')
  const units = unitDefinitions[category]
  const sourceUnit = units.some((unit) => unit.id === from) ? from : units[0].id
  const targetUnit = units.some((unit) => unit.id === to) ? to : units[1]?.id ?? units[0].id
  let result: number | null = null
  if (value !== '') {
    try { result = convertUnits(Number(value), category, sourceUnit, targetUnit) }
    catch { result = Number.NaN }
  }

  function changeCategory(next: UnitCategory) {
    setCategory(next)
    setFrom(unitDefinitions[next][0].id)
    setTo(unitDefinitions[next][1].id)
  }

  return <ToolLayout title="Unit Converter" description="Convert common length, weight, volume, and temperature measurements with results calculated locally.">
    <div className="data-tool calculator-tool">
      <ThemedSelect id="unit-category" label="Measurement" value={category} onChange={(next) => changeCategory(next as UnitCategory)} options={(Object.keys(unitDefinitions) as UnitCategory[]).map((item) => ({ value: item, label: categoryLabels[item] }))} />
      <div className="unit-converter-fields">
        <label htmlFor="unit-value">Value<input id="unit-value" type="number" step="any" value={value} onChange={(event) => setValue(event.target.value)} /></label>
        <ThemedSelect id="unit-from" label="From" value={sourceUnit} onChange={setFrom} options={units.map((unit) => ({ value: unit.id, label: unit.label }))} />
        <span className="unit-converter-arrow" aria-hidden="true">→</span>
        <ThemedSelect id="unit-to" label="To" value={targetUnit} onChange={setTo} options={units.map((unit) => ({ value: unit.id, label: unit.label }))} />
      </div>
      {result !== null && Number.isFinite(result) ? <div className="calculator-result" aria-live="polite"><span>Converted value</span><strong>{result.toLocaleString(undefined, { maximumSignificantDigits: 10 })} <small>{units.find((unit) => unit.id === targetUnit)?.label}</small></strong></div> : <p className="data-tool-status is-error" role="alert">Enter a valid number to convert.</p>}
    </div>
  </ToolLayout>
}

export default UnitConverterPage
