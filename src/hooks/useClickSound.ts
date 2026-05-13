import { useCallback, useRef } from 'react'

/**
 * Soft UI "click" using Web Audio — tiny burst, no external assets.
 * Lazy-creates AudioContext on first interaction (browser autoplay policies).
 */
export function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  const playClick = useCallback(() => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!ctxRef.current) ctxRef.current = new Ctx()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') void ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch {
      /* ignore — audio may be blocked */
    }
  }, [])

  return playClick
}
