'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'
import type { BlogPost } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  tags: z.string(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

interface Props {
  post?: BlogPost
}

export default function BlogForm({ post }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(post?.coverImage || '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      category: post?.category || '',
      tags: post?.tags?.join(', ') || '',
      published: post?.published || false,
      featured: post?.featured || false,
    },
  })

  const titleValue = watch('title')

  function autoSlug() {
    if (!post) {
      setValue('slug', slugify(titleValue))
    }
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    const payload = {
      ...data,
      coverImage: coverImage || null,
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      publishedAt: data.published ? new Date().toISOString() : null,
    }

    try {
      const url = post ? `/api/blog/${post.slug}` : '/api/blog'
      const method = post ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(post ? 'Post updated!' : 'Post created!')
        router.push('/admin/blog')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to save post')
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className={labelClass}>TITLE</label>
          <input
            {...register('title')}
            onBlur={autoSlug}
            className={inputClass}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className={labelClass}>SLUG</label>
          <input {...register('slug')} className={inputClass} />
          {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className={labelClass}>EXCERPT</label>
          <textarea {...register('excerpt')} rows={2} className={inputClass + ' resize-none'} />
        </div>

        <div>
          <label className={labelClass}>CONTENT</label>
          <textarea {...register('content')} rows={12} className={inputClass + ' resize-y font-mono text-xs'} />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CATEGORY</label>
            <input {...register('category')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>TAGS (comma-separated)</label>
            <input {...register('tags')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>COVER IMAGE</label>
          <div className="mt-2 max-w-sm">
            <MediaPicker value={coverImage} onChange={setCoverImage} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('published')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Featured</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-crimson text-cream px-10 py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
      >
        {loading ? 'SAVING...' : post ? 'UPDATE POST' : 'CREATE POST'}
      </button>
    </form>
  )
}
