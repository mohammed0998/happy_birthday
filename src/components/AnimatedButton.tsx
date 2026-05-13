import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

/**
 * Large touch target, neon glass button with a “press in → spring out” luxury feel.
 */
export function AnimatedButton({ children, onClick, disabled }: Props) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        onClick()
      }}
      whileTap={{ scale: 0.86 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 520, damping: 15, mass: 0.55 }}
      className={[
        'relative isolate w-full max-w-[min(92vw,360px)] rounded-3xl px-8 py-5',
        'text-lg font-bold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_18px_60px_rgba(255,78,205,0.35),0_0_80px_rgba(168,85,247,0.25)]',
        'bg-white/10 backdrop-blur-xl',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38bdf8]',
        disabled ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Neon rim */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-l from-[#ff4ecd] via-[#a855f7] to-[#38bdf8] opacity-55 blur-xl"
      />
      <span className="relative drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">{children}</span>
    </motion.button>
  )
}
