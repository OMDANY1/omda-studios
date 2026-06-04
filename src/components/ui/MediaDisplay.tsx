'use client'

import Image from 'next/image'
import type { MediaItem } from '@/lib/media'

interface MediaDisplayProps {
  item: MediaItem
  alt: string
  fill?: boolean
  className?: string
  videoClassName?: string
  priority?: boolean
}

export default function MediaDisplay({
  item,
  alt,
  fill = true,
  className = 'object-cover',
  videoClassName,
  priority,
}: MediaDisplayProps) {
  if (item.type === 'video') {
    return (
      <video
        src={item.url}
        className={videoClassName ?? (fill ? `absolute inset-0 w-full h-full ${className}` : className)}
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  if (fill) {
    return (
      <Image
        src={item.url}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    )
  }

  return (
    <img src={item.url} alt={alt} className={className} />
  )
}
