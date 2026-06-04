import type { Metadata } from 'next'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import type { Media } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Media',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getMedia() {
  return fetchApi<Media[]>('/api/upload')
}

export default async function MediaPage() {
  const media = await getMedia()

  return (
    <>
      <section className="bg-cream pt-28 pb-0 px-6 md:px-10">
        <Reveal>
          <div className="mb-16">
            <h1
              className="font-display font-black leading-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
            >
              <span className="text-charcoal block">VISUAL</span>
              <span className="text-crimson block">ARCHIVE</span>
            </h1>
            <p className="text-sm text-mid-gray mt-6 max-w-md">
              A curated gallery of studio assets, direction stills, and production imagery.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {media.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 0.05}>
              <figure className="group relative aspect-square overflow-hidden bg-zinc-200">
                <Image
                  src={item.url}
                  alt={item.alt ?? item.filename}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-charcoal/80 text-cream px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-label truncate">{item.filename}</p>
                  {item.alt && <p className="text-xs text-cream/60 mt-1 truncate">{item.alt}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {media.length === 0 && (
          <Reveal>
            <p className="text-sm text-mid-gray py-20 border-t border-charcoal/10">
              No media assets uploaded yet.
            </p>
          </Reveal>
        )}
      </section>

      <CtaSection />
    </>
  )
}
