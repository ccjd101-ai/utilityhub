export interface TextMetrics {
  characters: number
  charactersWithoutWhitespace: number
  words: number
  lines: number
}

export function countTextMetrics(text: string): TextMetrics {
  const graphemes = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)]
  const words = [...new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text)]
    .filter((part) => part.isWordLike).length

  return {
    characters: graphemes.length,
    charactersWithoutWhitespace: graphemes.filter((part) => !/^\s+$/u.test(part.segment)).length,
    words,
    lines: text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length,
  }
}
