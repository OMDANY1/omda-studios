'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { MediaItem } from '@/lib/media'
import { PLACEHOLDER_IMAGE } from '@/lib/utils'

interface MediaDisplayProps {
  item: MediaItem
  alt: string
  fill?: boolean
  className?: string
  videoClassName?: string
  priority?: boolean
  poster?: string | null
}

export default function MediaDisplay({
  item,
  alt,
  fill = true,
  className = 'object-cover',
  videoClassName,
  priority,
  poster,
}: MediaDisplayProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const sizeClass = fill ? `absolute inset-0 w-full h-full ${className}` : className
  const fadeClass = `transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`

  if (item.type === 'video') {
    return (
      <video
        src={error ? undefined : item.url}
        poster={poster || undefined}
        className={`${videoClassName ?? sizeClass} ${fadeClass}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        onError={() => {
          setError(true)
          setLoaded(true)
        }}
      />
    )
  }

  const src = error ? PLACEHOLDER_IMAGE : item.url

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${fadeClass}`}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true)
          setLoaded(true)
        }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${fadeClass}`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setError(true)
        setLoaded(true)
      }}
    />
  )
}
