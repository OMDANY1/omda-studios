'use client'

import { useState } from 'react'
import Reveal from '@/components/animations/Reveal'
import type { Service } from '@/types'

interface ServicesSectionProps {
  services: Service[]
  label?: string | null
  title?: string | null
  description?: string | null
}

export default function ServicesSection({
  services,
  label,
  title,
  description,
}: ServicesSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  if (services.length === 0) {
    return (
      <section className="bg-cream section-spacing section-padding">
        <div className="text-center py-12 border border-charcoal/10">
          <p className="text-label text-light-gray">Services coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream section-spacing section-padding border-t border-charcoal/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
        <div className="md:sticky md:top-28">
          {label && (
            <Reveal>
              <p className="text-label text-light-gray mb-6">{label}</p>
            </Reveal>
          )}
          {title && (
            <Reveal delay={0.08}>
              <h2 className="section-heading text-crimson mb-6 whitespace-pre-line">{title}</h2>
            </Reveal>
          )}
          {description && (
            <Reveal delay={0.16}>
              <p className="prose-editorial max-w-md">{description}</p>
            </Reveal>
          )}
        </div>

        <div className="border-t border-charcoal/10">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <div
                className="group border-b border-charcoal/10 py-6 md:py-7 flex items-center justify-between cursor-default transition-colors duration-500"
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-label text-light-gray w-6">0{i + 1}</span>
                  <h3
                    className={`font-display font-black text-lg md:text-2xl uppercase transition-colors duration-500 ${
                      hovered === service.id ? 'text-crimson' : 'text-charcoal'
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>
                {service.description && (
                  <span
                    className={`text-crimson text-xl transition-all duration-500 ${
                      hovered === service.id ? 'translate-x-1 opacity-100' : 'opacity-40'
                    }`}
                  >
                    +
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
