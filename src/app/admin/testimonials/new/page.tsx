import TestimonialForm from '@/components/admin/TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">New Testimonial</h1>
        <p className="text-sm text-gray-500 mt-1">Create a client testimonial</p>
      </div>
      <TestimonialForm />
    </div>
  )
}
