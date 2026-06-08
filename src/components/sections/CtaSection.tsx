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
  const inView = useInView(ref, { once: true, margin: '-80px 0px', amount: 0.2 })

  if (!title && !subtitle && !buttonText) return null

  return (
    <section
      ref={ref}
      className="bg-crimson section-spacing section-padding relative overflow-hidden border-t border-crimson-800/30"
    >
      {title && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span
            className="font-display font-black text-cream/[0.04] whitespace-nowrap"
            style={{ fontSize: 'clamp(6rem, 24vw, 22rem)' }}
          >
            {title}
          </span>
        </div>
      )}

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {title && (
          <motion.h2
            className="font-display font-black text-cream leading-[0.92] mb-5"
            style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
        )}

        {subtitle && (
          <motion.p
            className="text-label text-cream/55 mb-10 md:mb-12 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {subtitle}
          </motion.p>
        )}

        {buttonText && link && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={link}
              className="inline-block border border-cream/80 text-cream text-label px-10 py-4 min-h-[48px] hover:bg-cream hover:text-crimson transition-all duration-500 ease-expo-out"
            >
              {buttonText}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
