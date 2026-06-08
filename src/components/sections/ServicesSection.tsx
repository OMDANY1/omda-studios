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
      <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
        <div className="text-center py-12 border border-charcoal/10 rounded-sm">
          <p className="text-label text-light-gray">Services coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          {label && (
            <Reveal>
              <p className="text-label text-light-gray mb-6">{label}</p>
            </Reveal>
          )}
          {title && (
            <Reveal delay={0.1}>
              <h2 className="font-display font-black text-4xl md:text-5xl text-crimson leading-tight mb-4 whitespace-pre-line">
                {title}
              </h2>
            </Reveal>
          )}
          {description && (
            <Reveal delay={0.2}>
              <p className="text-sm text-mid-gray leading-relaxed max-w-sm">{description}</p>
            </Reveal>
          )}
        </div>

        <div className="border-t border-charcoal/10">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.1}>
              <div
                className="group border-b border-charcoal/10 py-6 flex items-center justify-between cursor-default"
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-label text-light-gray">0{i + 1}</span>
                  <h3
                    className={`font-display font-black text-xl md:text-2xl uppercase transition-colors duration-300 ${
                      hovered === service.id ? 'text-crimson' : 'text-charcoal'
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>
                {service.description && (
                  <span
                    className={`text-crimson transition-transform duration-300 ${
                      hovered === service.id ? 'translate-x-1' : ''
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
