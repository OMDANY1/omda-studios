'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { TeamMember } from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  bio: z.string().optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  order: z.number().default(0),
  published: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

interface TeamMemberFormProps {
  member?: TeamMember
}

export default function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(member?.image || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      email: member?.email || '',
      linkedin: member?.linkedin || '',
      instagram: member?.instagram || '',
      order: member?.order || 0,
      published: member?.published !== undefined ? member.published : true,
    },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch(member ? `/api/team/${member.id}` : '/api/team', {
        method: member ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save team member')
      }

      toast.success(member ? 'Team member updated' : 'Team member created')
      router.push('/admin/team')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save team member')
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
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PROFILE IMAGE</h2>
        <div className="max-w-sm">
          <MediaPicker value={image} onChange={setImage} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">MEMBER DETAILS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>NAME *</label>
            <input {...register('name')} className={inputClass} placeholder="Member name" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>ROLE *</label>
            <input {...register('role')} className={inputClass} placeholder="Creative Director" />
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>BIO</label>
          <textarea
            {...register('bio')}
            rows={4}
            className={inputClass + ' resize-none'}
            placeholder="Short bio..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">CONTACT LINKS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>EMAIL</label>
            <input {...register('email')} className={inputClass} placeholder="name@example.com" />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>LINKEDIN</label>
            <input {...register('linkedin')} className={inputClass} placeholder="https://linkedin.com/..." />
          </div>
          <div>
            <label className={labelClass}>INSTAGRAM</label>
            <input {...register('instagram')} className={inputClass} placeholder="https://instagram.com/..." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">PUBLISHING</h2>
        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('published')} className="w-4 h-4 accent-crimson" />
            <span className="text-sm text-charcoal">Published</span>
          </label>
          <div className="w-28">
            <label className={labelClass}>ORDER</label>
            <input type="number" {...register('order', { valueAsNumber: true })} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-crimson text-cream py-3 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
        >
          {loading ? 'SAVING...' : member ? 'UPDATE MEMBER' : 'CREATE MEMBER'}
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
