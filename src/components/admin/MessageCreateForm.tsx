'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MessageCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to create message')

      toast.success('Message created')
      form.reset()
      router.refresh()
    } catch {
      toast.error('Failed to create message')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-crimson transition-colors'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">ADD MESSAGE</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input name="name" className={inputClass} placeholder="Name" required />
        <input name="email" type="email" className={inputClass} placeholder="Email" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <div className="space-y-4">
          <input name="subject" className={inputClass} placeholder="Subject (optional)" />
          <textarea
            name="message"
            rows={3}
            className={inputClass + ' resize-none'}
            placeholder="Message"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'ADDING...' : 'ADD'}
        </button>
      </div>
    </form>
  )
}
