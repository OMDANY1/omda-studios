'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-cream pt-14 overflow-hidden">
      <div className="px-6 md:px-10 pt-12 md:pt-16">
        {/* Giant OMDA text */}
        <div className="relative">
          <motion.h1
            className="font-display font-black text-crimson leading-none select-none"
            style={{ fontSize: 'clamp(6rem, 22vw, 20rem)' }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            OMDA
          </motion.h1>

          {/* Hero image positioned over text */}
          <motion.div
            className="absolute right-0 md:right-4 top-0 w-1/2 md:w-[45%] aspect-[4/3] overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <div className="w-full h-full bg-charcoal relative">
              {/* Placeholder - replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
              </div>
              {/* Silhouette overlay effect */}
              <div className="absolute inset-0 bg-charcoal/20" />
            </div>
          </motion.div>
        </div>

        {/* Sub-labels and description */}
        <motion.div
          className="mt-8 md:mt-4 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <p className="text-label text-mid-gray mb-3">ART DIRECTION / DIGITAL CRAFT</p>
          <p className="text-sm text-mid-gray leading-relaxed font-body">
            A curation of visual narratives where editorial precision meets raw brutalist expression.
            We build digital monographs for the bold.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
