import { prisma } from '@/lib/prisma'
import HomepageForm from '@/components/admin/HomepageForm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const HOMEPAGE_ID = 'default'

async function getData() {
  const [homepage, projects] = await Promise.all([
    prisma.homepage.findUnique({ where: { id: HOMEPAGE_ID } }),
    prisma.project.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, title: true, slug: true, coverImage: true, published: true },
    }),
  ])

  const defaultHomepage = {
    id: HOMEPAGE_ID,
    heroTitle: 'OMDA',
    heroLabel: 'ART DIRECTION / DIGITAL CRAFT',
    heroSubtitle: null,
    heroDescription:
      'A curation of visual narratives where editorial precision meets raw brutalist expression. We build digital monographs for the bold.',
    heroCtaText: null,
    heroCtaLink: null,
    heroMediaUrl: null,
    heroMediaType: 'image',
    featuredProjectIds: [] as string[],
    updatedAt: new Date(),
  }

  return {
    homepage: homepage ?? defaultHomepage,
    projects,
  }
}

export default async function AdminHomepagePage() {
  const { homepage, projects } = await getData()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-charcoal">Homepage Content</h1>
        <p className="text-sm text-gray-400 mt-1">
          Edit the hero section and choose featured projects for the homepage.
        </p>
      </div>
      <HomepageForm homepage={homepage} projects={projects} />
    </div>
  )
}
