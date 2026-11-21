import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '@/data/siteData'
import { ChibiDuduk } from '@/components/ui/ChibiSprites'

/**
 * Layar pembuka saat situs pertama dimuat.
 * Gunung digambar dengan stroke yang tumbuh seperti sedang digambar,
 * lalu logo dan bilah progress muncul.
 */
export function Preloader({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Progress diisi bertahap dengan kecepatan stabil agar proses terlihat jelas.
    const duration = 1200
    const startedAt = performance.now()
    let frameId

    const animate = (now) => {
      const elapsed = now - startedAt
      const linear = Math.min(1, elapsed / duration)
      // Kecepatan linear membuat setiap kenaikan progress terlihat jelas.
      const next = linear * 100
      setProgress(next)

      if (next < 100) {
        frameId = window.requestAnimationFrame(animate)
      } else {
        // Pastikan angka 100% sempat terlihat sebelum layar ditutup.
        setProgress(100)
        window.setTimeout(() => {
          setVisible(false)
          onFinish?.()
        }, 300)
      }
    }

    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [onFinish])

  if (!visible) return null

  return (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-canvas"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* Pola titik latar */}
          <div className="dot-grid absolute inset-0 opacity-40" />

          <div className="relative flex w-full max-w-sm flex-col items-center gap-8 px-6">
            {/* Gunung dengan garis tumbuh, ditemani chibi kecil */}
            <div className="relative h-24 w-40">
              <svg className="h-24 w-40" viewBox="0 0 160 100" fill="none">
                <motion.path
                  d="M6 92 L44 40 L64 64 L86 34 L128 92"
                  stroke="var(--color-mint-500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M6 92 L154 92"
                  stroke="var(--color-sky-peak-400)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.75, delay: 0.15, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="132"
                  cy="20"
                  r="8"
                  fill="var(--color-sun-400)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.35, ease: 'backOut' }}
                />
                <motion.path
                  d="M44 40 L34 50 L43 47 L52 53 Z"
                  fill="var(--color-mint-300)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.25 }}
                />
              </svg>
              <motion.span
                className="absolute top-5 right-2 w-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: [0, -3, 0] }}
                transition={{ opacity: { delay: 0.45, duration: 0.25 }, y: { delay: 0.45, duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
                aria-hidden="true"
              >
                <ChibiDuduk />
              </motion.span>
            </div>

            <div className="text-center">
              <motion.p
                className="font-display text-lg font-bold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <span className="text-gradient">{site.shortName}</span>
              </motion.p>
              <motion.p
                className="mt-1 text-xs tracking-[0.22em] text-ink-muted uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {site.role}
              </motion.p>
            </div>

            {/* Bilah progress */}
            <div className="w-full">
              <div className="h-1 w-full overflow-hidden rounded-full bg-mist-200 dark:bg-pine-900">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-mint-500 via-mint-400 to-sky-peak-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[0.7rem] font-medium text-ink-muted tabular-nums">
                <span>Menyiapkan pengalaman Anda</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
  )
}