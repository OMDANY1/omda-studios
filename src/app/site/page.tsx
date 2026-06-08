import { prisma } from '@/lib/prisma'
import { getHomepage } from '@/lib/cms'
import { buildSiteMetadata } from '@/lib/seo'
import { getSiteConfig } from '@/lib/cms'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import SelectedWorks from '@/components/sections/SelectedWorks'
import ServicesSection from '@/components/sections/ServicesSection'
import CtaSection from '@/components/sections/CtaSection'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return buildSiteMetadata(siteConfig)
}

export const dynamic = 'force-dynamic'

async function getData() {
  const [homepage, allPublished, services] = await Promise.all([
    getHomepage(),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
  ])

  const featuredIds = homepage.featuredProjectIds ?? []
  let projects = allPublished

  if (featuredIds.length > 0) {
    const byId = new Map(allPublished.map((p) => [p.id, p]))
    projects = featuredIds
      .map((id) => byId.get(id))
      .filter((p): p is (typeof allPublished)[number] => p !== undefined)
  } else {
    projects = allPublished.slice(0, 6)
  }

  console.log('[Homepage] Public site data:', {
    id: homepage.id,
    heroTitle: homepage.heroTitle,
    heroLabel: homepage.heroLabel,
    heroSubtitle: homepage.heroSubtitle,
    heroDescription: homepage.heroDescription,
    heroCtaText: homepage.heroCtaText,
    heroCtaLink: homepage.heroCtaLink,
    heroMediaUrl: homepage.heroMediaUrl,
    heroMediaType: homepage.heroMediaType,
    heroPosterUrl: homepage.heroPosterUrl,
    heroVideoEnabled: homepage.heroVideoEnabled,
    tickerPhrases: homepage.tickerPhrases,
    worksTitle: homepage.worksTitle,
    worksSubtitle: homepage.worksSubtitle,
    servicesLabel: homepage.servicesLabel,
    servicesTitle: homepage.servicesTitle,
    servicesDescription: homepage.servicesDescription,
    ctaTitle: homepage.ctaTitle,
    ctaSubtitle: homepage.ctaSubtitle,
    ctaButtonText: homepage.ctaButtonText,
    ctaLink: homepage.ctaLink,
    featuredProjectIds: homepage.featuredProjectIds,
    updatedAt: homepage.updatedAt,
  })

  return { projects, services, homepage }
}

export default async function HomePage() {
  const { projects, services, homepage } = await getData()

  return (
    <>
      <HeroSection content={homepage} />
      <TickerSection phrases={homepage.tickerPhrases} />
      <SelectedWorks
        projects={projects}
        title={homepage.worksTitle}
        subtitle={homepage.worksSubtitle}
      />
      <ServicesSection
        services={services}
        label={homepage.servicesLabel}
        title={homepage.servicesTitle}
        description={homepage.servicesDescription}
      />
      <CtaSection
        title={homepage.ctaTitle}
        subtitle={homepage.ctaSubtitle}
        buttonText={homepage.ctaButtonText}
        link={homepage.ctaLink}
      />
    </>
  )
}
