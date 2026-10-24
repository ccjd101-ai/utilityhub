import { describe, expect, it } from 'vitest'
import { formatText } from './textFormatter'

const defaults = {
  casing: 'unchanged' as const,
  trimWhitespace: false,
  collapseSpaces: false,
}

describe('formatText', () => {
  it('converts text to uppercase or lowercase', () => {
    expect(formatText('Hello, UtilityHub!', { ...defaults, casing: 'uppercase' }))
      .toBe('HELLO, UTILITYHUB!')
    expect(formatText('Hello, UtilityHub!', { ...defaults, casing: 'lowercase' }))
      .toBe('hello, utilityhub!')
  })

  it.each([
    ['title' as const, 'Hello, World!'],
    ['sentence' as const, 'Hello, world! Next line.'],
    ['camel' as const, 'helloWorld'],
    ['pascal' as const, 'HelloWorld'],
    ['snake' as const, 'hello_world'],
    ['constant' as const, 'HELLO_WORLD'],
    ['kebab' as const, 'hello-world'],
    ['screaming-kebab' as const, 'HELLO-WORLD'],
    ['train' as const, 'Hello-World'],
    ['dot' as const, 'hello.world'],
  ])('converts words to %s casing', (casing, expected) => {
    const source = casing === 'title' ? 'hello, WORLD!' : 'hello WORLD'
    const sentenceSource = 'hello, WORLD! next line.'
    expect(
      formatText(casing === 'sentence' ? sentenceSource : source, {
        ...defaults,
        casing,
      }),
    ).toBe(expected)
  })

  it('splits camel case and acronyms into readable words', () => {
    expect(formatText('myHTTPServer', { ...defaults, casing: 'snake' }))
      .toBe('my_http_server')
  })

  it('trims leading and trailing whitespace when enabled', () => {
    expect(formatText('\n  keep this  \t', { ...defaults, trimWhitespace: true }))
      .toBe('keep this')
  })

  it('collapses repeated spaces without removing line breaks', () => {
    expect(
      formatText('one   two\nthree  four', {
        ...defaults,
        collapseSpaces: true,
      }),
    ).toBe('one two\nthree four')
  })

  it('combines requested transformations', () => {
    expect(
      formatText('  Hello   There  ', {
        casing: 'lowercase',
        trimWhitespace: true,
        collapseSpaces: true,
      }),
    ).toBe('hello there')
  })

  it('keeps empty input empty', () => {
    expect(formatText('', defaults)).toBe('')
  })
})
