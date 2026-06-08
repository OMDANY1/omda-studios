import { prisma } from '@/lib/prisma'
import { getHomepage } from '@/lib/cms'
import HomepageForm from '@/components/admin/HomepageForm'

export const dynamic = 'force-dynamic'

async function getData() {
  const [homepage, projects] = await Promise.all([
    getHomepage(),
    prisma.project.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, title: true, slug: true, coverImage: true, published: true },
    }),
  ])

  return { homepage, projects }
}

export default async function AdminHomepagePage() {
  const { homepage, projects } = await getData()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-black text-charcoal">Homepage Content</h1>
        <p className="text-sm text-gray-400 mt-1">
          Edit hero media, section copy, and featured projects for the homepage.
        </p>
      </div>
      <HomepageForm homepage={homepage} projects={projects} />
    </div>
  )
}
