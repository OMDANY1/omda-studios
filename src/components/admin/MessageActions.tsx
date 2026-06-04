'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Archive, Check, CheckCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  messageId: string
  currentStatus: string
}

export default function MessageActions({ messageId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(status: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  async function deleteMessage() {
    if (!confirm('Delete this message?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Deleted')
        router.refresh()
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus === 'UNREAD' && (
        <button
          onClick={() => updateStatus('READ')}
          disabled={loading}
          title="Mark as read"
          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      {currentStatus !== 'REPLIED' && (
        <button
          onClick={() => updateStatus('REPLIED')}
          disabled={loading}
          title="Mark as replied"
          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
        </button>
      )}
      {currentStatus !== 'ARCHIVED' && (
        <button
          onClick={() => updateStatus('ARCHIVED')}
          disabled={loading}
          title="Archive"
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Archive className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={deleteMessage}
        disabled={loading}
        title="Delete"
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
