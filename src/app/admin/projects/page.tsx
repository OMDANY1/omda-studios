import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Eye, EyeOff } from 'lucide-react'
import AdminProjectActions from '@/components/admin/AdminProjectActions'

async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: 'asc' } })
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          NEW PROJECT
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">TITLE</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium hidden md:table-cell">CATEGORY</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium hidden lg:table-cell">FEATURED</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">STATUS</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-charcoal text-sm">{project.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">/{project.slug}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  {project.featured ? (
                    <span className="text-xs bg-crimson/10 text-crimson px-2 py-1 rounded">Featured</span>
                  ) : (
                    <span className="text-xs text-gray-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                      project.published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <AdminProjectActions projectId={project.id} slug={project.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No projects yet.</p>
            <Link href="/admin/projects/new" className="text-crimson text-sm mt-2 inline-block hover:underline">
              Create your first project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
