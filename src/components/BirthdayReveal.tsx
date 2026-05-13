import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const TITLE = '🎉 عيد ميلاد سعيد  🎉'

/** Exact celebratory note — line breaks preserved for cinematic reveal. */
const PERSONAL_NOTE = `اليوم نهار زوين حيث فبحال هاد التاريخ فـ 2005 تزادت لبطيبيطة 💖
واليوم كبرات عام آخر ولكن متخافيش متشارفيش ههههه ✨
بغيت نقول ليك عيد ميلاد سعيد وكل عام ونتي بخير ❤️`

type Props = {
  /** Start typewriter once mounted */
  active: boolean
}

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Hero birthday beat: title typewriter + personal note (multi-line typewriter),
 * sparkles, micro hearts, soft glow, and a final pulsing heart accent.
 */
export function BirthdayReveal({ active }: Props) {
  const titleTw = useTypewriter({ text: TITLE, speedMs: 34, active })
  const noteActive = active && titleTw.done
  const noteTw = useTypewriter({ text: PERSONAL_NOTE, speedMs: 22, active: noteActive })

  const noteLines = useMemo(() => noteTw.output.split('\n'), [noteTw.output])

  const microHearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        key: i,
        top: `${(rand(i + 1) * 78 + 6).toFixed(1)}%`,
        left: `${(rand(i + 2) * 88 + 4).toFixed(1)}%`,
        delay: (rand(i + 3) * 1.8).toFixed(2),
        dur: (4.5 + rand(i + 4) * 3).toFixed(2),
        sym: rand(i + 5) > 0.55 ? '💗' : '💜',
      })),
    [],
  )

  const titleDone = titleTw.done
  const noteDone = noteTw.done

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 26, filter: 'blur(14px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[min(94vw,760px)] px-4"
    >
      {/* Sparkles ring */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-[clamp(14px,3.6vw,22px)]"
            style={{
              top: `${6 + (i % 8) * 11}%`,
              left: `${4 + ((i * 7) % 92)}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.25], rotate: [0, 18, -10, 0], scale: [0.9, 1.15, 0.95] }}
            transition={{ duration: 2.2 + (i % 5) * 0.25, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
            aria-hidden
          >
            ✨
          </motion.span>
        ))}
      </div>

      {/* Floating micro-hearts hugging the card */}
      <div className="pointer-events-none absolute inset-0 -z-[5] overflow-visible" aria-hidden>
        {microHearts.map((h) => (
          <motion.span
            key={h.key}
            className="absolute text-[clamp(12px,3.2vw,18px)] opacity-70"
            style={{ top: h.top, left: h.left }}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ y: [0, -10, 0], opacity: [0.35, 0.75, 0.35], rotate: [0, 8, -6, 0] }}
            transition={{
              duration: Number(h.dur),
              delay: Number(h.delay),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {h.sym}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10"
        animate={titleDone && noteDone ? { y: [0, -5, 0] } : { y: 0 }}
        transition={{ duration: 3.4, repeat: titleDone && noteDone ? Infinity : 0, ease: 'easeInOut' }}
      >
        <motion.h2
          className="font-display text-center text-[clamp(1.55rem,5.4vw,2.75rem)] font-extrabold leading-snug text-balance bg-gradient-to-l from-[#ff4ecd] via-[#f472b6] to-[#38bdf8] bg-clip-text text-transparent"
          style={{ WebkitBackgroundClip: 'text' }}
          animate={
            titleDone
              ? {
                  y: [0, -3, 0],
                  textShadow: [
                    '0 0 22px rgba(255,78,205,0.35), 0 0 60px rgba(168,85,247,0.22)',
                    '0 0 30px rgba(56,189,248,0.45), 0 0 70px rgba(255,78,205,0.28)',
                    '0 0 22px rgba(255,78,205,0.35), 0 0 60px rgba(168,85,247,0.22)',
                  ],
                }
              : { textShadow: '0 0 18px rgba(255,78,205,0.22)' }
          }
          transition={{ duration: 2.6, repeat: titleDone ? Infinity : 0, ease: 'easeInOut' }}
        >
          {titleTw.output}
          {!titleTw.done && active ? (
            <motion.span
              aria-hidden
              className="mr-1 inline-block h-[1.1em] w-[2px] translate-y-[0.12em] rounded-full bg-white/70 align-middle"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 0.85, repeat: Infinity }}
            />
          ) : null}
        </motion.h2>

        {/* Personal note: line-by-line cinematic reveal + soft neon glow */}
        <motion.div
          className="font-sans mx-auto mt-7 max-w-[52ch] text-pretty"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {noteLines.map((line, idx) => {
            const hasContent = line.length > 0
            return (
              <motion.p
                key={idx}
                className="text-center text-[clamp(0.95rem,3.35vw,1.12rem)] font-medium leading-[1.75] text-white/92 sm:leading-[1.85]"
                initial={false}
                animate={
                  hasContent
                    ? {
                        opacity: 1,
                        y: 0,
                        textShadow: [
                          '0 0 14px rgba(255,78,205,0.22), 0 0 34px rgba(168,85,247,0.18)',
                          '0 0 20px rgba(244,114,182,0.35), 0 0 48px rgba(168,85,247,0.26)',
                          '0 0 14px rgba(255,78,205,0.22), 0 0 34px rgba(168,85,247,0.18)',
                        ],
                      }
                    : { opacity: 0, y: 0 }
                }
                transition={
                  hasContent
                    ? {
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                        textShadow: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : { duration: 0.2 }
                }
              >
                {line}
                {!noteTw.done && noteActive && idx === noteLines.length - 1 ? (
                  <motion.span
                    aria-hidden
                    className="mr-1 inline-block h-[1.05em] w-[2px] translate-y-[0.1em] rounded-full bg-pink-200/80 align-middle"
                    animate={{ opacity: [1, 0.12, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                ) : null}
              </motion.p>
            )
          })}

          {/* Extra animated heart accent at the end (after full note is typed) */}
          {noteDone ? (
            <motion.div
              className="mt-4 flex justify-center"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <motion.span
                aria-hidden
                className="select-none text-[clamp(1.75rem,6vw,2.35rem)]"
                animate={{
                  scale: [1, 1.18, 1],
                  filter: [
                    'drop-shadow(0 0 14px rgba(255,78,205,0.55))',
                    'drop-shadow(0 0 26px rgba(244,114,182,0.75))',
                    'drop-shadow(0 0 14px rgba(255,78,205,0.55))',
                  ],
                }}
                transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
              >
                ❤️
              </motion.span>
            </motion.div>
          ) : null}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
