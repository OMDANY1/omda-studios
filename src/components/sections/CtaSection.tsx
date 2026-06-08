'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface CtaSectionProps {
  title?: string | null
  subtitle?: string | null
  buttonText?: string | null
  link?: string | null
}

export default function CtaSection({ title, subtitle, buttonText, link }: CtaSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  if (!title && !subtitle && !buttonText) return null

  return (
    <section ref={ref} className="bg-crimson py-24 md:py-36 px-6 md:px-10 relative overflow-hidden">
      {title && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span
            className="font-display font-black text-cream/5 whitespace-nowrap"
            style={{ fontSize: 'clamp(8rem, 30vw, 28rem)' }}
          >
            {title}
          </span>
        </div>
      )}

      <div className="relative z-10 text-center">
        {title && (
          <motion.h2
            className="font-display font-black text-cream leading-none mb-4"
            style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
        )}

        {subtitle && (
          <motion.p
            className="text-label text-cream/60 mb-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}

        {buttonText && link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <Link
              href={link}
              className="inline-block border border-cream text-cream text-label px-10 py-4 hover:bg-cream hover:text-crimson transition-all duration-300"
            >
              {buttonText}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
