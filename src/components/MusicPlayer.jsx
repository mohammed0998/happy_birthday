import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

/** Public asset path (place your romantic instrumental MP3 here). */
const AUDIO_SRC = '/music/happy-birthday.mp3'

/** Soft target level after fade-in (keep gentle on mobile speakers). */
const TARGET_VOL = 0.26

/** Gentle entry so it feels magical, not abrupt. */
const FADE_IN_MS = 3200

/** Smooth mute / unmute ramps. */
const TOGGLE_MS = 420

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}

/**
 * HTML5 birthday soundtrack with:
 * - `startFromUserGesture()` for mobile autoplay rules (call synchronously from click)
 * - cosine-smoothed volume ramps (fade-in + mute transitions)
 * - looping playback + glass UI toggle (top-right)
 */
const MusicPlayer = forwardRef(function MusicPlayer(_props, ref) {
  const audioRef = useRef(null)
  const startedRef = useRef(false)
  const rafRef = useRef(0)
  const mountedRef = useRef(true)

  const [started, setStarted] = useState(false)
  const [userMuted, setUserMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  const stopRaf = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }, [])

  /** Cosine-eased volume ramp (feels more “premium” than linear). */
  const rampVolume = useCallback(
    (from, to, ms, onDone) => {
      stopRaf()
      const t0 = performance.now()

      const tick = (now) => {
        if (!mountedRef.current) return
        const el = audioRef.current
        if (!el) return

        const a = clamp((now - t0) / ms, 0, 1)
        const eased = 0.5 - Math.cos(Math.PI * a) / 2
        const v = from + (to - from) * eased
        el.volume = clamp(v, 0, 1)

        if (a < 1) rafRef.current = requestAnimationFrame(tick)
        else {
          rafRef.current = 0
          onDone?.()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    },
    [stopRaf],
  )

  useImperativeHandle(
    ref,
    () => ({
      /** Must be invoked synchronously inside the “نعم 💖” click handler. */
      startFromUserGesture() {
        const el = audioRef.current
        if (!el || startedRef.current) return

        // Lock immediately so rapid taps can’t enqueue multiple `play()` calls.
        startedRef.current = true

        el.loop = true
        el.volume = 0

        void el
          .play()
          .then(() => {
            setStarted(true)
            setPlaying(true)
            rampVolume(0, TARGET_VOL, FADE_IN_MS)
          })
          .catch(() => {
            startedRef.current = false
            setStarted(false)
            setPlaying(false)
          })
      },
    }),
    [rampVolume],
  )

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopRaf()
      // Stop decoding / playback when leaving the celebration screen.
      audioRef.current?.pause()
    }
  }, [stopRaf])

  const onToggleMute = () => {
    const el = audioRef.current
    if (!el || !startedRef.current) return

    const nextMuted = !userMuted
    setUserMuted(nextMuted)

    stopRaf()

    if (nextMuted) {
      rampVolume(el.volume, 0, TOGGLE_MS, () => {
        setPlaying(false)
        el.pause()
      })
    } else {
      void el
        .play()
        .then(() => {
          setPlaying(true)
          rampVolume(el.volume, TARGET_VOL, TOGGLE_MS)
        })
        .catch(() => {
          setPlaying(false)
        })
    }
  }

  const showPulse = started && !userMuted && playing

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" playsInline className="sr-only" />

      <motion.button
        type="button"
        onClick={onToggleMute}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: started ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 26 }}
        aria-pressed={started && !userMuted}
        aria-label={userMuted ? 'إلغاء كتم الموسيقى' : 'كتم الموسيقى'}
        disabled={!started}
        className={[
          'fixed top-[max(12px,env(safe-area-inset-top))] right-[max(12px,env(safe-area-inset-right))] z-[95]',
          'grid h-14 w-14 place-items-center rounded-2xl border border-white/15',
          'bg-white/10 text-xl shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38bdf8]',
          started ? 'opacity-100' : 'opacity-55',
          !started ? 'pointer-events-none' : '',
        ].join(' ')}
      >
        <span className="relative grid place-items-center">
          🎵

          {/* Playing pulse ring */}
          {showPulse ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                boxShadow: '0 0 0 1px rgba(255,78,205,0.35), 0 0 40px rgba(168,85,247,0.35)',
              }}
            />
          ) : null}

          {/* Status dot */}
          <span
            aria-hidden
            className={[
              'absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full',
              !started ? 'bg-white/25' : userMuted ? 'bg-white/35' : 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]',
            ].join(' ')}
          />
        </span>
      </motion.button>
    </>
  )
})

MusicPlayer.displayName = 'MusicPlayer'

export default MusicPlayer
