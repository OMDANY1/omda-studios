'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, ExternalLink, Eye, EyeOff, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  projectId: string
  slug: string
  published: boolean
  featured: boolean
}

export default function AdminProjectActions({ projectId, slug, published, featured }: Props) {
  const router = useRouter()

  async function updateField(field: 'published' | 'featured', value: boolean) {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      toast.error('Failed to update project')
    }
  }

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
      <button
        type="button"
        onClick={() => updateField('published', !published)}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title={published ? 'Unpublish' : 'Publish'}
      >
        {published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        type="button"
        onClick={() => updateField('featured', !featured)}
        className={`p-1.5 transition-colors ${featured ? 'text-crimson' : 'text-gray-400 hover:text-charcoal'}`}
        title={featured ? 'Unfeature' : 'Feature'}
      >
        <Star className="w-4 h-4" />
      </button>
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
