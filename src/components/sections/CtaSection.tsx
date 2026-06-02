'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CtaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-crimson py-24 md:py-36 px-6 md:px-10 relative overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="font-display font-black text-cream/5 whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 30vw, 28rem)' }}
        >
          CREATE
        </span>
      </div>

      <div className="relative z-10 text-center">
        <motion.h2
          className="font-display font-black text-cream leading-none mb-4"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          CREATE
        </motion.h2>

        <motion.p
          className="text-label text-cream/60 mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          HAVE A PROJECT IN MIND? LET'S CURATE IT.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Link
            href="/contact"
            className="inline-block border border-cream text-cream text-label px-10 py-4 hover:bg-cream hover:text-crimson transition-all duration-300"
          >
            START A CONVERSATION
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
