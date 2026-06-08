import type { Metadata } from 'next'
import type { SiteConfig } from '@/types'

const FALLBACK_TITLE = 'OMDA Studios'
const FALLBACK_DESCRIPTION =
  'Art direction and digital craft for bold creative brands.'

export function buildSiteMetadata(
  siteConfig: SiteConfig,
  overrides?: {
    title?: string
    description?: string
    image?: string
    path?: string
  }
): Metadata {
  const siteName = siteConfig.siteName || FALLBACK_TITLE
  const title = overrides?.title || siteConfig.metaTitle || siteName
  const description =
    overrides?.description || siteConfig.metaDescription || FALLBACK_DESCRIPTION
  const image = overrides?.image || siteConfig.ogImage
  const baseUrl = siteConfig.siteUrl?.replace(/\/$/, '') || 'https://omdastudios.com'
  const url = overrides?.path ? `${baseUrl}${overrides.path}` : baseUrl

  return {
    title: overrides?.title ? { absolute: title } : title,
    description,
    keywords: siteConfig.metaKeywords.length > 0 ? siteConfig.metaKeywords : undefined,
    authors: [{ name: siteName }],
    creator: siteName,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName,
      title,
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: { index: true, follow: true },
  }
}

export function buildOrganizationJsonLd(siteConfig: SiteConfig, about?: { email?: string | null } | null) {
  const baseUrl = siteConfig.siteUrl?.replace(/\/$/, '') || 'https://omdastudios.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.siteName || FALLBACK_TITLE,
    url: baseUrl,
    ...(siteConfig.ogImage ? { logo: siteConfig.ogImage } : {}),
    ...(about?.email ? { email: about.email } : {}),
  }
}
