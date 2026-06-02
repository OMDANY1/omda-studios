import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects',
}

async function getProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <section className="bg-cream pt-28 pb-0 px-6 md:px-10">
        {/* Header */}
        <Reveal>
          <div className="mb-16">
            <h1 className="font-display font-black leading-none" style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}>
              <span className="text-charcoal block">SELECTED</span>
              <span className="text-crimson block">WORKS</span>
            </h1>
            <p className="text-sm text-mid-gray mt-6 max-w-md">
              A curated archive of visual identities, digital experiences, and architectural art
              direction for the avant-garde.
            </p>
          </div>
        </Reveal>

        {/* Featured Quote */}
        <Reveal delay={0.1}>
          <blockquote className="py-16 border-t border-charcoal/10">
            <p className="font-display font-black text-2xl md:text-4xl lg:text-5xl text-charcoal leading-tight max-w-3xl">
              &ldquo;DESIGN IS NOT JUST{' '}
              <span className="text-crimson italic">DECORATION,</span> IT IS THE{' '}
              <em>ARCHITECTURE OF ATTENTION.</em>&rdquo;
            </p>
          </blockquote>
        </Reveal>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-charcoal/10">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block border-b border-r-0 md:border-r border-charcoal/10 p-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-500 group-hover:from-zinc-200 transition-all duration-500" />
                  )}

                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-crimson px-3 py-1">
                      <span className="text-label text-cream">FEATURED</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-label bg-cream/90 px-2 py-1">
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display font-black text-xl md:text-2xl uppercase text-charcoal group-hover:text-crimson transition-colors">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-sm text-mid-gray mt-2 max-w-sm">{project.description}</p>
                      )}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-crimson opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
