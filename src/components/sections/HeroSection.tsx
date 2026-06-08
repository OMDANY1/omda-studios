'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import HeroMedia from '@/components/ui/HeroMedia'
import type { MediaItemType } from '@/lib/media'
import { isWebmUrl } from '@/lib/media'

export interface HeroContent {
  heroTitle: string
  heroLabel?: string | null
  heroSubtitle?: string | null
  heroDescription?: string | null
  heroCtaText?: string | null
  heroCtaLink?: string | null
  heroMediaUrl?: string | null
  heroMediaMp4Url?: string | null
  heroMediaType?: string | null
  heroPosterUrl?: string | null
  heroVideoEnabled?: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

export default function HeroSection({ content }: { content: HeroContent }) {
  const title = content.heroTitle || ''
  const label = content.heroLabel || ''
  const description = content.heroDescription || ''
  const mediaType: MediaItemType =
    content.heroMediaType === 'video' ? 'video' : 'image'
  const hasMedia = Boolean(content.heroMediaUrl || content.heroPosterUrl)
  const isTransparentVideo =
    mediaType === 'video' &&
    content.heroVideoEnabled !== false &&
    Boolean(content.heroMediaUrl && isWebmUrl(content.heroMediaUrl))

  return (
    <section className="relative min-h-[90vh] md:min-h-screen bg-cream pt-16 md:pt-20 overflow-hidden">
      <div className="section-padding pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-end">
          {/* Typography column */}
          <div className="md:col-span-5 lg:col-span-4 order-2 md:order-1">
            {title && (
              <motion.h1
                className="hero-title font-display font-black text-crimson leading-[0.92] tracking-tight select-none"
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
              >
                {title}
              </motion.h1>
            )}

            {(content.heroSubtitle || label || description || (content.heroCtaText && content.heroCtaLink)) && (
              <motion.div
                className="mt-8 md:mt-10 max-w-md space-y-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.45 }}
              >
                {content.heroSubtitle && (
                  <p className="font-display text-xl md:text-2xl text-charcoal leading-snug">
                    {content.heroSubtitle}
                  </p>
                )}
                {label && <p className="text-label text-mid-gray">{label}</p>}
                {description && (
                  <p className="text-sm md:text-base text-mid-gray leading-relaxed font-body max-w-prose">
                    {description}
                  </p>
                )}
                {content.heroCtaText && content.heroCtaLink && (
                  <Link
                    href={content.heroCtaLink}
                    className="inline-block mt-2 text-label border border-charcoal/15 px-7 py-3.5 hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-500 ease-expo-out"
                  >
                    {content.heroCtaText.toUpperCase()}
                  </Link>
                )}
              </motion.div>
            )}
          </div>

          {/* Media column — larger, primary visual */}
          {hasMedia && (
            <motion.div
              className="md:col-span-7 lg:col-span-8 order-1 md:order-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.3 }}
            >
              <div
                className={`hero-media-frame relative w-full aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/10] ${
                  isTransparentVideo ? 'hero-media-frame--transparent' : ''
                }`}
              >
                <HeroMedia
                  className="absolute inset-0"
                  mediaUrl={content.heroMediaUrl}
                  mp4Url={content.heroMediaMp4Url}
                  posterUrl={content.heroPosterUrl}
                  mediaType={mediaType}
                  videoEnabled={content.heroVideoEnabled}
                  alt={title || 'Hero media'}
                  priority
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
