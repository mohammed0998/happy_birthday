import { motion } from 'framer-motion'
import { AnimatedButton } from './AnimatedButton'

type Props = {
  onConfirm: () => void
  busy?: boolean
}

/**
 * First beat: question + single luxury CTA (mobile-first spacing).
 */
export function IntroCard({ onConfirm, busy }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, filter: 'blur(12px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[min(92vw,560px)] px-4"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
        <motion.h1
          className="font-display mx-auto max-w-[min(92vw,36ch)] text-balance text-center text-[clamp(1.35rem,4.6vw,2.05rem)] font-bold leading-snug text-white"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
        >
          🎂 هل اليوم 10 يونيو عيد ميلادك؟
        </motion.h1>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65 }}
        >
          <AnimatedButton onClick={onConfirm} disabled={busy}>
            نعم 💖
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.section>
  )
}
