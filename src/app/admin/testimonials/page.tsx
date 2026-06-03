import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Star, Pencil } from 'lucide-react'

async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">{testimonials.length} testimonials</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD TESTIMONIAL
        </Link>
      </div>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-crimson text-crimson" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{t.content}"</p>
                <div>
                  <p className="font-bold text-charcoal text-sm">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-xs text-gray-400">
                      {[t.role, t.company].filter(Boolean).join(' / ')}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={`/admin/testimonials/${t.id}/edit`}
                className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-sm">No testimonials yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
