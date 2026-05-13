import { motion } from 'framer-motion'

/**
 * Cinematic startup loader — short, premium, mobile-friendly.
 * Parent controls unmount timing for predictable UX.
 */
export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(120%_120%_at_50%_20%,#1a0b2e_0%,#050210_55%,#020108_100%)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative px-6 text-center">
        <motion.div
          className="mx-auto mb-6 h-24 w-24 rounded-full bg-white/10 shadow-[0_0_60px_rgba(255,78,205,0.35),0_0_120px_rgba(168,85,247,0.25)] backdrop-blur-xl"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.p
          className="text-lg font-semibold tracking-wide text-white/90 sm:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          جاري تجهيز المفاجأة…
        </motion.p>
        <motion.div
          className="mx-auto mt-6 h-1 max-w-[220px] overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-[#ff4ecd] via-[#a855f7] to-[#38bdf8]"
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ duration: 1.25, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
