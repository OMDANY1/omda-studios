'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { Testimonial } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  content: z.string().trim().min(1, 'Content is required'),
  rating: z.number().min(1).max(5).default(5),
  order: z.number().default(0),
  published: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

interface TestimonialFormProps {
  testimonial?: Testimonial
}

export default function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(testimonial?.image || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: testimonial?.name || '',
      company: testimonial?.company || '',
      role: testimonial?.role || '',
      content: testimonial?.content || '',
      rating: testimonial?.rating || 5,
      order: testimonial?.order || 0,
      published: testimonial?.published !== undefined ? testimonial.published : true,
    },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch(
        testimonial ? `/api/testimonials/${testimonial.id}` : '/api/testimonials',
        {
          method: testimonial ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, image }),
        }
      )

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save testimonial')
      }

      toast.success(testimonial ? 'Testimonial updated' : 'Testimonial created')
      router.push('/admin/testimonials')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save testimonial')
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
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">CLIENT IMAGE</h2>
        <div className="max-w-sm">
          <MediaPicker value={image} onChange={setImage} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">TESTIMONIAL</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>NAME *</label>
            <input {...register('name')} className={inputClass} placeholder="Client name" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>ROLE</label>
            <input {...register('role')} className={inputClass} placeholder="Founder" />
          </div>
          <div>
            <label className={labelClass}>COMPANY</label>
            <input {...register('company')} className={inputClass} placeholder="Company" />
          </div>
        </div>

        <div>
          <label className={labelClass}>CONTENT *</label>
          <textarea
            {...register('content')}
            rows={5}
            className={inputClass + ' resize-none'}
            placeholder="Client testimonial..."
          />
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PUBLISHING</h2>
        <div className="grid grid-cols-1 md:grid-cols-[8rem_8rem_1fr] gap-4 items-end">
          <div>
            <label className={labelClass}>RATING</label>
            <input
              type="number"
              min={1}
              max={5}
              {...register('rating', { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>ORDER</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className={inputClass} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pb-2">
            <input type="checkbox" {...register('published')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Published</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-crimson text-cream py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'SAVING...' : testimonial ? 'UPDATE TESTIMONIAL' : 'CREATE TESTIMONIAL'}
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
