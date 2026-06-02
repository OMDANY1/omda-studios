'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { About } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'

interface Props {
  about: About | null
}

export default function SettingsForm({ about }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(about?.image || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      })

      if (res.ok) {
        toast.success('Settings saved!')
        router.refresh()
      } else {
        toast.error('Failed to save settings')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-crimson transition-colors'
  const labelClass = 'block text-xs tracking-widest text-gray-400 mb-1.5 font-medium'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Profile Image */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PROFILE IMAGE</h2>
        <div className="max-w-sm">
          <MediaPicker value={image} onChange={setImage} />
        </div>
      </div>

      {/* About Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">ABOUT SECTION</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>HEADLINE</label>
            <input name="headline" defaultValue={about?.headline || 'THE CURATOR'} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>TAGLINE / ROLE</label>
            <input name="tagline" defaultValue={about?.tagline || ''} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>MAIN DESCRIPTION</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={about?.description || ''}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div>
          <label className={labelClass}>PHILOSOPHY</label>
          <textarea
            name="philosophy"
            rows={3}
            defaultValue={about?.philosophy || ''}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>APPROACH 01</label>
            <textarea
              name="approach1"
              rows={3}
              defaultValue={about?.approach1 || ''}
              className={inputClass + ' resize-none'}
            />
          </div>
          <div>
            <label className={labelClass}>APPROACH 02</label>
            <textarea
              name="approach2"
              rows={3}
              defaultValue={about?.approach2 || ''}
              className={inputClass + ' resize-none'}
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">CONTACT INFO</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>EMAIL</label>
            <input name="email" type="email" defaultValue={about?.email || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>PHONE</label>
            <input name="phone" defaultValue={about?.phone || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LOCATION</label>
            <input name="location" defaultValue={about?.location || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>EST. YEAR</label>
            <input name="estYear" defaultValue={about?.estYear || '2018'} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">SOCIAL LINKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>INSTAGRAM</label>
            <input name="instagram" defaultValue={about?.instagram || ''} className={inputClass} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={labelClass}>LINKEDIN</label>
            <input name="linkedin" defaultValue={about?.linkedin || ''} className={inputClass} placeholder="https://linkedin.com/..." />
          </div>
          <div>
            <label className={labelClass}>BEHANCE</label>
            <input name="behance" defaultValue={about?.behance || ''} className={inputClass} placeholder="https://behance.net/..." />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-crimson text-cream px-10 py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </form>
  )
}
