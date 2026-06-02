import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import SelectedWorks from '@/components/sections/SelectedWorks'
import ServicesSection from '@/components/sections/ServicesSection'
import CtaSection from '@/components/sections/CtaSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OMDA Studios — Art Direction & Digital Craft',
}

async function getData() {
  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
  ])
  return { projects, services }
}

export default async function HomePage() {
  const { projects, services } = await getData()

  return (
    <>
      <HeroSection />
      <TickerSection />
      <SelectedWorks projects={projects} />
      <ServicesSection services={services} />
      <CtaSection />
    </>
  )
}
