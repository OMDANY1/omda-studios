'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMemberActionsProps {
  memberId: string
  published: boolean
}

export default function TeamMemberActions({ memberId, published }: TeamMemberActionsProps) {
  const router = useRouter()

  async function updatePublished() {
    try {
      const res = await fetch(`/api/team/${memberId}`, {
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

  async function deleteMember() {
    if (!confirm('Delete this team member?')) return

    try {
      const res = await fetch(`/api/team/${memberId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete team member')

      toast.success('Team member deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete team member')
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
        href={`/admin/team/${memberId}/edit`}
        className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        type="button"
        onClick={deleteMember}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
