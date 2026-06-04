'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MediaDisplay from '@/components/ui/MediaDisplay'
import type { MediaItemType } from '@/lib/media'

export interface HeroContent {
  heroTitle: string
  heroLabel?: string | null
  heroSubtitle?: string | null
  heroDescription?: string | null
  heroCtaText?: string | null
  heroCtaLink?: string | null
  heroMediaUrl?: string | null
  heroMediaType?: string | null
}

export default function HeroSection({ content }: { content: HeroContent }) {
  const title = content.heroTitle || 'OMDA'
  const label = content.heroLabel || 'ART DIRECTION / DIGITAL CRAFT'
  const description =
    content.heroDescription ||
    'A curation of visual narratives where editorial precision meets raw brutalist expression. We build digital monographs for the bold.'
  const mediaType: MediaItemType =
    content.heroMediaType === 'video' ? 'video' : 'image'
  const hasMedia = Boolean(content.heroMediaUrl)

  return (
    <section className="relative min-h-screen bg-cream pt-14 overflow-hidden">
      <div className="px-6 md:px-10 pt-12 md:pt-16">
        <div className="relative">
          <motion.h1
            className="font-display font-black text-crimson leading-none select-none"
            style={{ fontSize: 'clamp(6rem, 22vw, 20rem)' }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.div
            className="absolute right-0 md:right-4 top-0 w-1/2 md:w-[45%] aspect-[4/3] overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <div className="w-full h-full bg-charcoal relative">
              {hasMedia && content.heroMediaUrl ? (
                <MediaDisplay
                  item={{ url: content.heroMediaUrl, type: mediaType }}
                  alt={title}
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                </div>
              )}
              <div className="absolute inset-0 bg-charcoal/20 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 md:mt-4 max-w-xs md:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {content.heroSubtitle && (
            <p className="font-display text-lg md:text-xl text-charcoal mb-3">{content.heroSubtitle}</p>
          )}
          <p className="text-label text-mid-gray mb-3">{label}</p>
          <p className="text-sm text-mid-gray leading-relaxed font-body">{description}</p>
          {content.heroCtaText && content.heroCtaLink && (
            <Link
              href={content.heroCtaLink}
              className="inline-block mt-6 text-label border border-charcoal/20 px-6 py-3 hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              {content.heroCtaText.toUpperCase()}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
