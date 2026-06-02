import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'

interface PageProps {
  params: { id: string }
}

async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } })
}

export default async function EditProjectPage({ params }: PageProps) {
  const project = await getProject(params.id)
  if (!project) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Edit Project</h1>
        <p className="text-sm text-gray-500 mt-1">{project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
