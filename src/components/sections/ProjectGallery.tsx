'use client'

import Reveal from '@/components/animations/Reveal'
import MediaDisplay from '@/components/ui/MediaDisplay'
import type { MediaItem } from '@/lib/media'

interface ProjectGalleryProps {
  items: MediaItem[]
  title: string
}

export default function ProjectGallery({ items, title }: ProjectGalleryProps) {
  if (items.length === 0) return null

  return (
    <section className="bg-cream px-6 md:px-10 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <Reveal key={`${item.url}-${i}`} delay={i * 0.1}>
            <div className="aspect-[4/3] relative overflow-hidden bg-zinc-200">
              <MediaDisplay item={item} alt={`${title} ${i + 1}`} className="object-cover" />
              <p className="absolute bottom-4 left-4 text-label text-charcoal/60">
                DIRECTION DETAIL 0{i + 1}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
