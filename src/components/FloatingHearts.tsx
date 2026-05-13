import { motion } from 'framer-motion'
import { useMemo } from 'react'

function rand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

type Props = {
  /** Reduce particles on low-power devices via parent */
  count?: number
  /** Faster upward drift for the post-reveal celebration */
  intense?: boolean
}

/**
 * Ambient floating hearts — lightweight transforms, no layout thrash.
 */
export function FloatingHearts({ count = 18, intense = false }: Props) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = rand(i + 1)
      const left = `${(r * 100).toFixed(2)}%`
      const delay = (rand(i + 3) * 2.2).toFixed(2)
      const base = 3.5 + rand(i + 7) * 3
      const duration = (intense ? base * 0.62 : base).toFixed(2)
      const scale = (0.55 + rand(i + 9) * 0.85).toFixed(2)
      const emoji = r > 0.66 ? '💗' : r > 0.33 ? '💜' : '💙'
      return { key: i, left, delay, duration, scale, emoji }
    })
  }, [count, intense])

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {items.map((h) => (
        <motion.span
          key={h.key}
          className="absolute -top-10 text-[clamp(16px,4.2vw,26px)] will-change-transform"
          style={{ left: h.left, scale: Number(h.scale) }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.9, 0.75, 0] }}
          transition={{
            duration: Number(h.duration),
            delay: Number(h.delay),
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  )
}
