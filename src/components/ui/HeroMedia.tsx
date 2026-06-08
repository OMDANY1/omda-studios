'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { isWebmUrl, isMp4Url } from '@/lib/media'

export interface HeroMediaProps {
  mediaUrl?: string | null
  mp4Url?: string | null
  posterUrl?: string | null
  mediaType: 'image' | 'video'
  videoEnabled?: boolean
  alt: string
  priority?: boolean
  className?: string
}

type RenderMode = 'video' | 'poster' | 'image'

export default function HeroMedia({
  mediaUrl,
  mp4Url,
  posterUrl,
  mediaType,
  videoEnabled = true,
  alt,
  priority,
  className = '',
}: HeroMediaProps) {
  const [mode, setMode] = useState<RenderMode>(() => {
    if (mediaType === 'image' && mediaUrl) return 'image'
    if (videoEnabled !== false && mediaType === 'video' && mediaUrl) return 'video'
    if (posterUrl) return 'poster'
    if (mediaUrl && mediaType === 'image') return 'image'
    return 'poster'
  })
  const [loaded, setLoaded] = useState(false)

  const webmSrc = mediaUrl && isWebmUrl(mediaUrl) ? mediaUrl : null
  const resolvedMp4 =
    mp4Url ||
    (mediaUrl && isMp4Url(mediaUrl) ? mediaUrl : null) ||
    (mediaUrl && !isWebmUrl(mediaUrl) && mediaType === 'video' ? mediaUrl : null)

  const isTransparent = mode === 'video' && Boolean(webmSrc)
  const fadeClass = `transition-opacity duration-1000 ease-expo-out ${loaded ? 'opacity-100' : 'opacity-0'}`
  const videoFitClass = isTransparent ? 'object-contain' : 'object-cover'

  const handleVideoError = useCallback(() => {
    if (posterUrl) {
      setMode('poster')
      setLoaded(false)
      return
    }
    if (mediaUrl && mediaType === 'image') {
      setMode('image')
      setLoaded(false)
    }
  }, [posterUrl, mediaUrl, mediaType])

  const containerClasses = [
    'hero-media relative w-full h-full',
    isTransparent ? 'hero-media--transparent' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (mode === 'video' && mediaUrl && videoEnabled !== false && mediaType === 'video') {
    return (
      <div className={containerClasses}>
        <video
          className={`hero-media__video absolute inset-0 w-full h-full ${videoFitClass} ${fadeClass}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
          onLoadedData={() => setLoaded(true)}
          onError={handleVideoError}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {resolvedMp4 && resolvedMp4 !== webmSrc && (
            <source src={resolvedMp4} type="video/mp4" />
          )}
          {!webmSrc && !resolvedMp4 && mediaUrl && (
            <source src={mediaUrl} type="video/mp4" />
          )}
        </video>
      </div>
    )
  }

  if (mode === 'poster' && posterUrl) {
    return (
      <div className={containerClasses}>
        <Image
          src={posterUrl}
          alt={alt}
          fill
          className={`object-cover ${fadeClass}`}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 55vw"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (mediaUrl && mediaType === 'image') {
              setMode('image')
              setLoaded(false)
            }
          }}
        />
      </div>
    )
  }

  if ((mode === 'image' || mediaType === 'image') && mediaUrl) {
    return (
      <div className={`${containerClasses} hero-media--image`}>
        <Image
          src={mediaUrl}
          alt={alt}
          fill
          className={`object-cover ${fadeClass}`}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 55vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
    )
  }

  return null
}
