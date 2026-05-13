import { motion } from 'framer-motion'
import { useMemo } from 'react'

function rnd(n: number) {
  const x = Math.sin(n * 27.123) * 10000
  return x - Math.floor(x)
}

type Props = {
  count?: number
}

/**
 * Soft floating balloons — subtle parallax for depth (kept intentionally light).
 */
export function FloatingBalloons({ count = 8 }: Props) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = `${(rnd(i + 1) * 92 + 4).toFixed(2)}%`
      const delay = (rnd(i + 2) * 2.6).toFixed(2)
      const duration = (10 + rnd(i + 3) * 8).toFixed(2)
      const drift = `${((rnd(i + 4) - 0.5) * 40).toFixed(2)}px`
      return { key: i, left, delay, duration, drift }
    })
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      {items.map((b) => (
        <motion.span
          key={b.key}
          className="absolute -bottom-12 text-[clamp(22px,6vw,40px)] drop-shadow-[0_18px_40px_rgba(255,78,205,0.25)]"
          style={{ left: b.left }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: ['110vh', '-18vh'], x: ['0', b.drift, '0'], opacity: [0, 0.75, 0.75, 0] }}
          transition={{ duration: Number(b.duration), delay: Number(b.delay), repeat: Infinity, ease: 'linear' }}
        >
          🎈
        </motion.span>
      ))}
    </div>
  )
}
