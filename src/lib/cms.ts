import { prisma } from '@/lib/prisma'
import type { About, Homepage, SiteConfig } from '@/types'

export const HOMEPAGE_ID = 'default'
export const SITE_CONFIG_ID = 'default'

const defaultHomepageData = {
  heroTitle: '',
  heroLabel: '',
  heroDescription: '',
  heroMediaType: 'image',
  heroVideoEnabled: true,
  tickerPhrases: [] as string[],
  featuredProjectIds: [] as string[],
}

const defaultSiteConfigData = {
  siteName: 'OMDA Studios',
  metaKeywords: [] as string[],
}

export async function getHomepage(): Promise<Homepage> {
  const homepage = await prisma.homepage.findUnique({ where: { id: HOMEPAGE_ID } })
  if (homepage) return homepage

  return prisma.homepage.create({
    data: { id: HOMEPAGE_ID, ...defaultHomepageData },
  })
}

export async function getAbout(): Promise<About | null> {
  return prisma.about.findFirst()
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    return await prisma.siteConfig.upsert({
      where: { id: SITE_CONFIG_ID },
      update: {},
      create: { id: SITE_CONFIG_ID, ...defaultSiteConfigData },
    })
  } catch {
    const config = await prisma.siteConfig.findUnique({ where: { id: SITE_CONFIG_ID } })
    if (config) return config
    throw new Error('Failed to load site config')
  }
}

export async function getSiteContext() {
  const [about, siteConfig] = await Promise.all([getAbout(), getSiteConfig()])
  return { about, siteConfig }
}
