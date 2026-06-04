'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'
import type { Project } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'
import MediaGalleryPicker from '@/components/admin/MediaGalleryPicker'
import { mergeProjectGallery, type MediaItem } from '@/lib/media'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string(),
  description: z.string().min(1, 'Description is required'),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  client: z.string().optional(),
  services: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  coverImage: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().default(0),
})

type FormData = z.infer<typeof schema>

interface Props {
  project?: Project
}

export default function ProjectForm({ project }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(project?.coverImage || '')
  const [gallery, setGallery] = useState<MediaItem[]>(() =>
    project ? mergeProjectGallery(project.gallery, project.images) : []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      category: project?.category || '',
      tags: project?.tags.join(', ') || '',
      description: project?.description || '',
      challenge: project?.challenge || '',
      solution: project?.solution || '',
      client: project?.client || '',
      services: project?.services || '',
      role: project?.role || '',
      location: project?.location || '',
      year: project?.year || '',
      coverImage: project?.coverImage || '',
      featured: project?.featured || false,
      published: project?.published !== undefined ? project.published : true,
      order: project?.order || 0,
    },
  })

  const titleValue = watch('title')

  function autoSlug() {
    if (!project) {
      setValue('slug', slugify(titleValue))
    }
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const payload = {
        ...data,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage,
        gallery,
      }

      const url = project ? `/api/projects/${project.id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(project ? 'Project updated!' : 'Project created!')
        router.push('/admin/projects')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Something went wrong')
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
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Cover Image */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">COVER IMAGE</h2>
        <MediaPicker
          value={coverImage}
          onChange={(url) => {
            setCoverImage(url)
            setValue('coverImage', url)
          }}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">GALLERY MEDIA</h2>
        <p className="text-xs text-gray-400 mb-4">
          Add multiple images and videos for the project detail page.
        </p>
        <MediaGalleryPicker value={gallery} onChange={setGallery} />
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">BASIC INFO</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>TITLE *</label>
            <input
              {...register('title')}
              className={inputClass}
              onBlur={autoSlug}
              placeholder="Project Title"
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>SLUG *</label>
            <input {...register('slug')} className={inputClass} placeholder="project-slug" />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CATEGORY *</label>
            <input {...register('category')} className={inputClass} placeholder="Branding, Editorial..." />
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>
          <div>
            <label className={labelClass}>TAGS (comma separated)</label>
            <input {...register('tags')} className={inputClass} placeholder="Branding, Identity, Visual" />
          </div>
        </div>

        <div>
          <label className={labelClass}>DESCRIPTION *</label>
          <textarea
            {...register('description')}
            rows={3}
            className={inputClass + ' resize-none'}
            placeholder="Short project description..."
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PROJECT DETAILS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>CLIENT</label>
            <input {...register('client')} className={inputClass} placeholder="Client Name" />
          </div>
          <div>
            <label className={labelClass}>SERVICES</label>
            <input {...register('services')} className={inputClass} placeholder="Visual ID, Web" />
          </div>
          <div>
            <label className={labelClass}>ROLE</label>
            <input {...register('role')} className={inputClass} placeholder="Lead Curator" />
          </div>
          <div>
            <label className={labelClass}>LOCATION</label>
            <input {...register('location')} className={inputClass} placeholder="Tokyo / NYC" />
          </div>
        </div>
        <div>
          <label className={labelClass}>THE CHALLENGE</label>
          <textarea
            {...register('challenge')}
            rows={4}
            className={inputClass + ' resize-none'}
            placeholder="Describe the challenge..."
          />
        </div>
        <div>
          <label className={labelClass}>THE SOLUTION / ART DIRECTION</label>
          <textarea
            {...register('solution')}
            rows={4}
            className={inputClass + ' resize-none'}
            placeholder="Describe the solution..."
          />
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PUBLISHING</h2>
        <div className="flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('published')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Published</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Featured</span>
          </label>
        </div>
        <div className="mt-4 w-24">
          <label className={labelClass}>ORDER</label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-crimson text-cream py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'SAVING...' : project ? 'UPDATE PROJECT' : 'CREATE PROJECT'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 border border-gray-200 text-gray-500 text-xs tracking-widest hover:bg-gray-50 transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}
