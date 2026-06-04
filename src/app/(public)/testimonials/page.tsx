import type { Metadata } from 'next'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import { Star } from 'lucide-react'
import type { Testimonial } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Testimonials',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getTestimonials() {
  return fetchApi<Testimonial[]>('/api/testimonials')
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <>
      <section className="bg-cream pt-28 pb-0 px-6 md:px-10">
        <Reveal>
          <div className="mb-16">
            <h1
              className="font-display font-black leading-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
            >
              <span className="text-charcoal block">CLIENT</span>
              <span className="text-crimson block">VOICES</span>
            </h1>
            <p className="text-sm text-mid-gray mt-6 max-w-md">
              What collaborators and partners say about working with OMDA Studios.
            </p>
          </div>
        </Reveal>

        <div className="space-y-0 border-t border-charcoal/10">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.id} delay={i * 0.08}>
              <article className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 py-12 md:py-16 border-b border-charcoal/10">
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover grayscale"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-300">
                        <span className="font-display font-black text-xl text-charcoal/40">
                          {testimonial.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-crimson text-crimson" />
                    ))}
                  </div>
                </div>

                <div>
                  <blockquote className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-charcoal leading-tight mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-display font-bold text-charcoal uppercase">{testimonial.name}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-label text-mid-gray mt-1">
                        {[testimonial.role, testimonial.company].filter(Boolean).join(' / ')}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {testimonials.length === 0 && (
          <Reveal>
            <p className="text-sm text-mid-gray py-20 border-t border-charcoal/10">
              Testimonials will appear here once published.
            </p>
          </Reveal>
        )}
      </section>

      <CtaSection />
    </>
  )
}
