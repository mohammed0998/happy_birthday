import { useEffect, useMemo, useState } from 'react'

type Options = {
  text: string
  /** ms between grapheme steps */
  speedMs?: number
  active: boolean
}

/**
 * Typewriter reveal using Unicode code points (handles emoji pairs better than raw index).
 */
export function useTypewriter({ text, speedMs = 42, active }: Options) {
  const graphemes = useMemo(() => {
    try {
      const seg = new Intl.Segmenter('ar', { granularity: 'grapheme' })
      return Array.from(seg.segment(text), (s) => s.segment)
    } catch {
      return Array.from(text)
    }
  }, [text])

  const [i, setI] = useState(0)

  useEffect(() => {
    if (!active) {
      setI(0)
      return
    }
    if (i >= graphemes.length) return

    const id = window.setTimeout(() => setI((v) => v + 1), speedMs)
    return () => window.clearTimeout(id)
  }, [active, graphemes.length, i, speedMs])

  const output = graphemes.slice(0, i).join('')
  const done = active && i >= graphemes.length

  return { output, done }
}
