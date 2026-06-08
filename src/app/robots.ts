import type { MetadataRoute } from 'next'
import { getSiteConfig } from '@/lib/cms'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig()
  const baseUrl = siteConfig.siteUrl?.replace(/\/$/, '') || 'https://omdastudios.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
