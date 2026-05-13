import { motion } from 'framer-motion'
import { useMemo } from 'react'

function rnd(n: number) {
  const x = Math.sin(n * 99.123) * 10000
  return x - Math.floor(x)
}

const palette = ['#ff4ecd', '#a855f7', '#38bdf8', '#f472b6', '#c084fc', '#22d3ee']

type Props = {
  active: boolean
  /** Keep confetti light on phones */
  particleCount?: number
}

/**
 * Burst confetti — short-lived explosion then gentle falloff.
 */
export function ConfettiEffect({ active, particleCount = 52 }: Props) {
  const pieces = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = rnd(i + 1) * Math.PI * 2
      const speed = 120 + rnd(i + 2) * 220
      const dx = Math.cos(angle) * speed
      const dy = Math.sin(angle) * speed * -1.15
      const rot = (rnd(i + 3) - 0.5) * 720
      const color = palette[i % palette.length]
      const w = 6 + rnd(i + 4) * 8
      const h = 10 + rnd(i + 5) * 12
      const delay = rnd(i + 6) * 0.08
      return { i, dx, dy, rot, color, w, h, delay }
    })
  }, [particleCount])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[40]" aria-hidden>
      {/* Center burst origin (avoid mixing CSS translate with Framer transforms). */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        {pieces.map((p) => (
          <motion.span
            key={p.i}
            className="absolute left-0 top-0 rounded-sm will-change-transform"
            style={{
              width: p.w,
              height: p.h,
              backgroundColor: p.color,
              boxShadow: `0 0 18px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.6 }}
            animate={{
              x: p.dx,
              y: [0, p.dy, p.dy * 1.35 + 220],
              opacity: [0, 1, 1, 0],
              rotate: p.rot,
              scale: [0.6, 1, 1, 0.85],
            }}
            transition={{
              duration: 1.85,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
