export type MediaItemType = 'image' | 'video'

export interface MediaItem {
  url: string
  type: MediaItemType
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes('/video/upload/')
}

export function isWebmUrl(url: string): boolean {
  return /\.webm(\?|$)/i.test(url)
}

export function isMp4Url(url: string): boolean {
  return /\.(mp4|m4v)(\?|$)/i.test(url) || (url.includes('/video/upload/') && !isWebmUrl(url))
}

export function inferMediaType(url: string, explicit?: string): MediaItemType {
  if (explicit === 'video' || explicit === 'image') return explicit
  return isVideoUrl(url) ? 'video' : 'image'
}

export function parseGallery(raw: unknown): MediaItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        return { url: item, type: inferMediaType(item) }
      }
      if (item && typeof item === 'object' && 'url' in item) {
        const obj = item as { url: unknown; type?: unknown }
        if (typeof obj.url !== 'string' || !obj.url) return null
        return {
          url: obj.url,
          type: inferMediaType(obj.url, typeof obj.type === 'string' ? obj.type : undefined),
        }
      }
      return null
    })
    .filter((item): item is MediaItem => item !== null)
}

export function galleryToLegacyImages(gallery: MediaItem[]): string[] {
  return gallery.filter((m) => m.type === 'image').map((m) => m.url)
}

export function legacyImagesToGallery(images: string[], existing?: MediaItem[]): MediaItem[] {
  if (existing && existing.length > 0) return existing
  return images.map((url) => ({ url, type: inferMediaType(url) }))
}

export function mergeProjectGallery(
  gallery: unknown,
  images: string[]
): MediaItem[] {
  const parsed = parseGallery(gallery)
  if (parsed.length > 0) return parsed
  return legacyImagesToGallery(images)
}
