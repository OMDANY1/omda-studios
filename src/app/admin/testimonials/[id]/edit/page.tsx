import { notFound } from 'next/navigation'
import TestimonialForm from '@/components/admin/TestimonialForm'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { id: string }
}

async function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({ where: { id } })
}

export default async function EditTestimonialPage({ params }: PageProps) {
  const testimonial = await getTestimonial(params.id)
  if (!testimonial) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Edit Testimonial</h1>
        <p className="text-sm text-gray-500 mt-1">{testimonial.name}</p>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
