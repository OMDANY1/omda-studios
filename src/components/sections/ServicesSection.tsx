'use client'

import { useState } from 'react'
import Reveal from '@/components/animations/Reveal'
import type { Service } from '@/types'

interface ServicesSectionProps {
  services: Service[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="bg-cream px-6 md:px-10 py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: Copy */}
        <div>
          <Reveal>
            <p className="text-label text-light-gray mb-6">WHAT WE DO</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display font-black text-4xl md:text-5xl text-crimson leading-tight mb-4">
              BEYOND THE
              <br />
              PIXEL GRID.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm text-mid-gray leading-relaxed max-w-sm">
              We reject the templated web. Our philosophy is rooted in the physical world —
              typography that breathes and layouts that demand attention.
            </p>
          </Reveal>
        </div>

        {/* Right: Services list */}
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
                <span
                  className={`text-crimson transition-transform duration-300 ${
                    hovered === service.id ? 'translate-x-1' : ''
                  }`}
                >
                  →
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
