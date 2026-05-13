import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BirthdayReveal } from './components/BirthdayReveal'
import { ConfettiEffect } from './components/ConfettiEffect'
import { FireworksBackground } from './components/FireworksBackground'
import { FloatingBalloons } from './components/FloatingBalloons'
import { FloatingHearts } from './components/FloatingHearts'
import { IntroCard } from './components/IntroCard'
import { LoadingScreen } from './components/LoadingScreen'
import { MouseGlow } from './components/MouseGlow'
import MusicPlayer from './components/MusicPlayer.jsx'
import { useClickSound } from './hooks/useClickSound'

type MusicPlayerHandle = {
  /** Call synchronously from the “نعم 💖” click handler (mobile autoplay). */
  startFromUserGesture: () => void
}

/**
 * App shell orchestrates the “loader → intro → reveal” story beat,
 * plus global ambience (mesh gradient, fireworks, particles, music).
 */
export default function App() {
  const [booting, setBooting] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false)
  const [confetti, setConfetti] = useState(false)

  const musicRef = useRef<MusicPlayerHandle | null>(null)
  const playClick = useClickSound()

  // Confetti density scales with viewport width (perf on phones).
  const [particleCount, setParticleCount] = useState(52)

  useEffect(() => {
    const update = () => setParticleCount(window.innerWidth < 640 ? 38 : 58)
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 2300)
    return () => window.clearTimeout(t)
  }, [])

  const onConfirm = useCallback(() => {
    if (busy || revealed) return

    // 1) Birthday music must begin in the same user-gesture tick as the tap (iOS / Chrome policies).
    musicRef.current?.startFromUserGesture()

    setBusy(true)
    playClick()
    setFlash(true)

    window.setTimeout(() => {
      setRevealed(true)
      setConfetti(true)
      window.setTimeout(() => setConfetti(false), 2400)
      window.setTimeout(() => setBusy(false), 520)
    }, 170)
  }, [busy, playClick, revealed])

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#050210] font-sans text-white">
      {/* Animated luxury mesh — intensifies after the reveal for a more emotional beat */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: booting ? 0.35 : 1 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          className="absolute -inset-[35%] blur-3xl"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(255,78,205,0.35), rgba(168,85,247,0.28), rgba(56,189,248,0.30), rgba(255,78,205,0.35))',
          }}
          animate={{
            rotate: [0, 360],
            opacity: revealed ? [0.95, 1, 0.95] : [0.72, 0.86, 0.72],
            scale: revealed ? [1, 1.06, 1] : [1, 1.02, 1],
          }}
          transition={{
            rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
            opacity: { duration: revealed ? 5.5 : 7.5, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: revealed ? 5.5 : 7.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(90%_70%_at_80%_90%,rgba(56,189,248,0.12),transparent_55%)]" />
      </motion.div>

      {/* Post-reveal ambience */}
      {revealed ? <FireworksBackground /> : null}
      <FloatingHearts count={revealed ? 34 : 14} intense={revealed} />
      {revealed ? <FloatingBalloons count={9} /> : null}
      <MouseGlow />

      {/* Soft flash */}
      <AnimatePresence>
        {flash ? (
          <motion.div
            key="flash"
            className="fixed inset-0 z-[80] bg-gradient-to-b from-white/30 via-[#ff4ecd]/18 to-[#38bdf8]/14"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setFlash(false)}
          />
        ) : null}
      </AnimatePresence>

      <ConfettiEffect active={confetti} particleCount={particleCount} />

      {/* Main stack */}
      <main className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center px-3 py-10 sm:px-6">
        <AnimatePresence mode="wait">
          {booting ? (
            <LoadingScreen key="loading" />
          ) : revealed ? (
            <BirthdayReveal key="reveal" active />
          ) : (
            <IntroCard key="intro" onConfirm={onConfirm} busy={busy} />
          )}
        </AnimatePresence>
      </main>

      {/* HTML5 soundtrack: mounted after boot, but audio only starts after the “نعم 💖” gesture. */}
      {!booting ? <MusicPlayer ref={musicRef} /> : null}
    </div>
  )
}
