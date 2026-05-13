import { motion, useMotionTemplate, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Desktop-only cursor glow (fine pointer) — adds a premium “spotlight” feel.
 */
export function MouseGlow() {
  const [finePointer, setFinePointer] = useState(false)
  const x = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 })
  const y = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 })

  const mask = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(255,78,205,0.22), transparent 65%)`

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!finePointer) return
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [finePointer, x, y])

  if (!finePointer) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3] mix-blend-screen motion-reduce:hidden"
      style={{ backgroundImage: mask }}
    />
  )
}
