import { motion } from 'framer-motion'
import { useMemo } from 'react'

function rnd(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Background fireworks: blurred radial bursts + slow parallax drift.
 * Designed to stay subtle so foreground typography stays readable.
 */
export function FireworksBackground() {
  const bursts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const top = `${(rnd(i + 1) * 85 + 5).toFixed(2)}%`
        const left = `${(rnd(i + 2) * 90 + 5).toFixed(2)}%`
        const delay = rnd(i + 3) * 2.2
        const size = 220 + rnd(i + 4) * 260
        const hue = rnd(i + 5) > 0.5 ? 'from-[#ff4ecd]/35' : 'from-[#38bdf8]/30'
        return { i, top, left, delay, size, hue }
      }),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Base glow wash */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_110%,rgba(168,85,247,0.35),transparent_60%)]" />

      {bursts.map((b) => (
        <motion.div
          key={b.i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${b.hue} via-[#a855f7]/20 to-transparent blur-2xl`}
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
          initial={{ opacity: 0, scale: 0.35 }}
          animate={{
            opacity: [0, 0.85, 0.35, 0.85, 0],
            scale: [0.35, 1.05, 0.75, 1.15, 0.55],
            rotate: [0, 25, -10, 18, 0],
          }}
          transition={{
            duration: 4.2 + rnd(b.i + 9) * 2.4,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Spark streaks */}
      <motion.div
        className="absolute -left-1/3 top-1/4 h-[2px] w-[70vw] rotate-12 bg-gradient-to-l from-transparent via-white/35 to-transparent blur-[1px]"
        animate={{ x: ['-20%', '40%'], opacity: [0.15, 0.55, 0.15] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/3 top-2/3 h-[2px] w-[70vw] -rotate-6 bg-gradient-to-l from-transparent via-[#ff4ecd]/35 to-transparent blur-[1px]"
        animate={{ x: ['20%', '-35%'], opacity: [0.12, 0.5, 0.12] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
