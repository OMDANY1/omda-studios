import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import SelectedWorks from '@/components/sections/SelectedWorks'
import ServicesSection from '@/components/sections/ServicesSection'
import CtaSection from '@/components/sections/CtaSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OMDA Studios - Art Direction & Digital Craft',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const HOMEPAGE_ID = 'default'

async function getData() {
  const [homepage, allPublished, services] = await Promise.all([
    prisma.homepage.findUnique({ where: { id: HOMEPAGE_ID } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
  ])

  const featuredIds = homepage?.featuredProjectIds ?? []
  let projects = allPublished

  if (featuredIds.length > 0) {
    const byId = new Map(allPublished.map((p) => [p.id, p]))
    projects = featuredIds
      .map((id) => byId.get(id))
      .filter((p): p is (typeof allPublished)[number] => p !== undefined)
  } else {
    projects = allPublished.slice(0, 6)
  }

  const heroContent = homepage ?? {
    heroTitle: 'OMDA',
    heroLabel: 'ART DIRECTION / DIGITAL CRAFT',
    heroSubtitle: null,
    heroDescription:
      'A curation of visual narratives where editorial precision meets raw brutalist expression. We build digital monographs for the bold.',
    heroCtaText: null,
    heroCtaLink: null,
    heroMediaUrl: null,
    heroMediaType: 'image',
  }

  return { projects, services, heroContent }
}

export default async function HomePage() {
  const { projects, services, heroContent } = await getData()

  return (
    <>
      <HeroSection content={heroContent} />
      <TickerSection />
      <SelectedWorks projects={projects} />
      <ServicesSection services={services} />
      <CtaSection />
    </>
  )
}
