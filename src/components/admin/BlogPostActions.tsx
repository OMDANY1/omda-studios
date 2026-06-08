'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  postId: string
  slug: string
  published: boolean
}

export default function BlogPostActions({ postId, slug, published }: Props) {
  const router = useRouter()

  async function togglePublished() {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !published,
          publishedAt: !published ? new Date().toISOString() : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      toast.success('Post deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={togglePublished}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title={published ? 'Unpublish' : 'Publish'}
      >
        {published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <Link
        href={`/admin/blog/${postId}/edit`}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
