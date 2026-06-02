'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  projectId: string
  slug: string
}

export default function AdminProjectActions({ projectId, slug }: Props) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this project? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Project deleted')
        router.refresh()
      } else {
        toast.error('Failed to delete project')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/site/projects/${slug}`}
        target="_blank"
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title="View"
      >
        <ExternalLink className="w-4 h-4" />
      </Link>
      <Link
        href={`/admin/projects/${projectId}/edit`}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
