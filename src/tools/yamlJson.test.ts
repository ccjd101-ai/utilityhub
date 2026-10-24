import { describe, expect, it } from 'vitest'
import { jsonToYaml, yamlToJson } from './yamlJson'

describe('YAML and JSON conversion', () => {
  it('converts YAML mappings and sequences to JSON', () => {
    expect(JSON.parse(yamlToJson('name: UtilityHub\ntags:\n  - tools\n  - web')))
      .toEqual({ name: 'UtilityHub', tags: ['tools', 'web'] })
  })

  it('converts JSON values to YAML', () => {
    expect(jsonToYaml('{"name":"UtilityHub","enabled":true}'))
      .toContain('name: UtilityHub')
  })

  it('rejects malformed or duplicate-key YAML and invalid JSON', () => {
    expect(() => yamlToJson('name: [')).toThrow()
    expect(() => yamlToJson('name: one\nname: two')).toThrow()
    expect(() => jsonToYaml('{broken')).toThrow()
  })

  it('rejects empty input', () => {
    expect(() => yamlToJson(' ')).toThrow('Enter YAML data')
    expect(() => jsonToYaml(' ')).toThrow('Enter JSON data')
  })
})
