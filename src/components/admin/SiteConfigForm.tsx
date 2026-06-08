'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { SiteConfig } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'

interface Props {
  siteConfig: SiteConfig
}

export default function SiteConfigForm({ siteConfig }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(siteConfig.logoUrl || '')
  const [ogImage, setOgImage] = useState(siteConfig.ogImage || '')
  const [keywords, setKeywords] = useState(siteConfig.metaKeywords.join(', '))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          logoUrl: logoUrl || null,
          ogImage: ogImage || null,
          metaKeywords: keywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success('Site settings saved!')
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

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-crimson transition-colors'
  const labelClass = 'block text-xs tracking-widest text-gray-400 mb-1.5 font-medium'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">SITE IDENTITY</h2>

        <div>
          <label className={labelClass}>SITE NAME</label>
          <input name="siteName" defaultValue={siteConfig.siteName} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>SITE URL</label>
          <input
            name="siteUrl"
            defaultValue={siteConfig.siteUrl || ''}
            className={inputClass}
            placeholder="https://omdastudios.com"
          />
        </div>

        <div>
          <label className={labelClass}>LOGO</label>
          <div className="mt-2 max-w-sm">
            <MediaPicker value={logoUrl} onChange={setLogoUrl} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">SEO SETTINGS</h2>

        <div>
          <label className={labelClass}>META TITLE</label>
          <input name="metaTitle" defaultValue={siteConfig.metaTitle || ''} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>META DESCRIPTION</label>
          <textarea
            name="metaDescription"
            rows={3}
            defaultValue={siteConfig.metaDescription || ''}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div>
          <label className={labelClass}>KEYWORDS (comma-separated)</label>
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>OPEN GRAPH IMAGE</label>
          <div className="mt-2 max-w-sm">
            <MediaPicker value={ogImage} onChange={setOgImage} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-crimson text-cream px-10 py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
      >
        {loading ? 'SAVING...' : 'SAVE SITE SETTINGS'}
      </button>
    </form>
  )
}
