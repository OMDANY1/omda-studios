'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  siteName?: string | null
}

export default function LoadingScreen({ siteName }: LoadingScreenProps) {
  const splashText = siteName?.split(' ')[0]?.toUpperCase() || 'OMDA'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only show on first visit
    const hasVisited = sessionStorage.getItem('omda-visited')
    if (hasVisited) {
      setLoading(false)
      return
    }
    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('omda-visited', 'true')
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-charcoal flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
        >
          <div className="relative overflow-hidden">
            <motion.h1
              className="font-display font-black text-cream text-8xl md:text-[12rem] leading-none tracking-tight"
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {splashText}
            </motion.h1>
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-crimson"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1], delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
