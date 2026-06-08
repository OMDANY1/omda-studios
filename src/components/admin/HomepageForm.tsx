'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Homepage, Project } from '@/types'
import HeroMediaPicker from '@/components/admin/HeroMediaPicker'
import MediaPicker from '@/components/admin/MediaPicker'

interface Props {
  homepage: Homepage
  projects: Pick<Project, 'id' | 'title' | 'slug' | 'coverImage' | 'published'>[]
}

export default function HomepageForm({ homepage, projects }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [heroMediaUrl, setHeroMediaUrl] = useState(homepage.heroMediaUrl || '')
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(
    homepage.heroMediaType === 'video' ? 'video' : 'image'
  )
  const [heroPosterUrl, setHeroPosterUrl] = useState(homepage.heroPosterUrl || '')
  const [heroVideoEnabled, setHeroVideoEnabled] = useState(homepage.heroVideoEnabled !== false)
  const [tickerPhrases, setTickerPhrases] = useState(
    (homepage.tickerPhrases || []).join('\n')
  )
  const [featuredIds, setFeaturedIds] = useState<string[]>(homepage.featuredProjectIds || [])

  const publishedProjects = projects.filter((p) => p.published)

  function toggleFeatured(projectId: string) {
    setFeaturedIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    )
  }

  function moveFeatured(projectId: string, direction: 'up' | 'down') {
    setFeaturedIds((prev) => {
      const index = prev.indexOf(projectId)
      if (index === -1) return prev
      const next = [...prev]
      const swap = direction === 'up' ? index - 1 : index + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const phrases = tickerPhrases
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)

    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          heroMediaUrl: heroMediaUrl || null,
          heroMediaType,
          heroPosterUrl: heroPosterUrl || null,
          heroVideoEnabled,
          tickerPhrases: phrases,
          featuredProjectIds: featuredIds,
        }),
      })

      if (res.ok) {
        toast.success('Homepage saved!')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to save homepage')
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">HERO SECTION</h2>

        <div>
          <label className={labelClass}>HERO TITLE</label>
          <input name="heroTitle" defaultValue={homepage.heroTitle} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>LABEL (above description)</label>
          <input name="heroLabel" defaultValue={homepage.heroLabel || ''} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>SUBTITLE</label>
          <input name="heroSubtitle" defaultValue={homepage.heroSubtitle || ''} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>DESCRIPTION</label>
          <textarea
            name="heroDescription"
            rows={4}
            defaultValue={homepage.heroDescription || ''}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CTA BUTTON TEXT</label>
            <input name="heroCtaText" defaultValue={homepage.heroCtaText || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CTA LINK</label>
            <input name="heroCtaLink" defaultValue={homepage.heroCtaLink || ''} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>HERO VIDEO / IMAGE</label>
          <div className="mt-2">
            <HeroMediaPicker
              url={heroMediaUrl}
              mediaType={heroMediaType}
              onChange={(url, type) => {
                setHeroMediaUrl(url)
                setHeroMediaType(type)
              }}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>HERO POSTER IMAGE (fallback when video disabled or loading)</label>
          <div className="mt-2 max-w-sm">
            <MediaPicker value={heroPosterUrl} onChange={setHeroPosterUrl} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={heroVideoEnabled}
            onChange={(e) => setHeroVideoEnabled(e.target.checked)}
            className="w-4 h-4 accent-crimson"
          />
          <span className="text-sm text-charcoal">Enable hero video (when video media is set)</span>
        </label>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">TICKER BANNER</h2>
        <div>
          <label className={labelClass}>PHRASES (one per line)</label>
          <textarea
            value={tickerPhrases}
            onChange={(e) => setTickerPhrases(e.target.value)}
            rows={4}
            className={inputClass + ' resize-none'}
            placeholder="RADICAL SIMPLICITY&#10;VISUAL AUTHORITY"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">SELECTED WORKS SECTION</h2>
        <div>
          <label className={labelClass}>SECTION TITLE (use \n for line break)</label>
          <input name="worksTitle" defaultValue={homepage.worksTitle || ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SUBTITLE</label>
          <input name="worksSubtitle" defaultValue={homepage.worksSubtitle || ''} className={inputClass} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">SERVICES SECTION</h2>
        <div>
          <label className={labelClass}>LABEL</label>
          <input name="servicesLabel" defaultValue={homepage.servicesLabel || ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>TITLE (use \n for line break)</label>
          <input name="servicesTitle" defaultValue={homepage.servicesTitle || ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>DESCRIPTION</label>
          <textarea
            name="servicesDescription"
            rows={3}
            defaultValue={homepage.servicesDescription || ''}
            className={inputClass + ' resize-none'}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">CTA SECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>TITLE</label>
            <input name="ctaTitle" defaultValue={homepage.ctaTitle || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SUBTITLE</label>
            <input name="ctaSubtitle" defaultValue={homepage.ctaSubtitle || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>BUTTON TEXT</label>
            <input name="ctaButtonText" defaultValue={homepage.ctaButtonText || ''} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>BUTTON LINK</label>
            <input name="ctaLink" defaultValue={homepage.ctaLink || ''} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-2">FEATURED PROJECTS</h2>
        <p className="text-xs text-gray-400 mb-4">
          Select projects for the homepage. Order controls display sequence.
        </p>

        {publishedProjects.length === 0 ? (
          <p className="text-sm text-gray-400">No published projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {publishedProjects.map((project) => {
              const selected = featuredIds.includes(project.id)
              const orderIndex = featuredIds.indexOf(project.id)
              return (
                <li
                  key={project.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    selected ? 'border-crimson/30 bg-crimson/5' : 'border-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleFeatured(project.id)}
                    className="w-4 h-4 accent-crimson"
                  />
                  {project.coverImage ? (
                    <img src={project.coverImage} alt="" className="w-12 h-9 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-9 bg-gray-200 rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{project.title}</p>
                    <p className="text-xs text-gray-400">{project.slug}</p>
                  </div>
                  {selected && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400 w-6 text-center">{orderIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveFeatured(project.id, 'up')}
                        className="p-1 text-gray-400 hover:text-charcoal"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFeatured(project.id, 'down')}
                        className="p-1 text-gray-400 hover:text-charcoal"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-crimson text-cream py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
      >
        {loading ? 'SAVING...' : 'SAVE HOMEPAGE'}
      </button>
    </form>
  )
}
