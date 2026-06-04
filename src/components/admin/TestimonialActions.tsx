'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface TestimonialActionsProps {
  testimonialId: string
  published: boolean
}

export default function TestimonialActions({ testimonialId, published }: TestimonialActionsProps) {
  const router = useRouter()

  async function updatePublished() {
    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      })

      if (!res.ok) throw new Error('Failed to update status')
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function deleteTestimonial() {
    if (!confirm('Delete this testimonial?')) return

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete testimonial')

      toast.success('Testimonial deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete testimonial')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={updatePublished}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title={published ? 'Hide' : 'Publish'}
      >
        {published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <Link
        href={`/admin/testimonials/${testimonialId}/edit`}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        type="button"
        onClick={deleteTestimonial}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
