import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import ProjectGallery from '@/components/sections/ProjectGallery'
import MediaDisplay from '@/components/ui/MediaDisplay'
import { mergeProjectGallery } from '@/lib/media'

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: {
      slug,
      published: true,
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProject(params.slug)
  if (!project) return {}
  return { title: project.title, description: project.description }
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProject(params.slug)
  if (!project) notFound()

  const gallery = mergeProjectGallery(project.gallery, project.images)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-charcoal min-h-[70vh] flex items-end overflow-hidden pt-14">
        {/* Background image */}
        <div className="absolute inset-0">
          {project.coverImage ? (
            <Image src={project.coverImage} alt={project.title} fill className="object-cover opacity-40" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-10 pb-16 w-full">
          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-label bg-crimson text-cream px-3 py-1">
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          <h1
            className="font-display font-black text-cream leading-none mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            {project.title.toUpperCase()}
          </h1>

          {project.description && (
            <p className="text-cream/70 max-w-xl text-base md:text-lg leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Meta grid */}
          {(project.client || project.services || project.role || project.location) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t border-cream/10 pt-8">
              {project.client && (
                <div>
                  <p className="text-label text-cream/30 mb-1">CLIENT</p>
                  <p className="text-sm text-cream font-medium">{project.client}</p>
                </div>
              )}
              {project.services && (
                <div>
                  <p className="text-label text-cream/30 mb-1">SERVICES</p>
                  <p className="text-sm text-cream font-medium">{project.services}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <p className="text-label text-cream/30 mb-1">ROLE</p>
                  <p className="text-sm text-cream font-medium">{project.role}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-label text-cream/30 mb-1">LOCATION</p>
                  <p className="text-sm text-cream font-medium">{project.location}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Challenge section */}
      {project.challenge && (
        <section className="bg-cream px-6 md:px-10 py-20">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-label text-light-gray mb-4">PHASE 01</p>
              <h2 className="font-display font-black text-4xl md:text-6xl text-charcoal mb-8 leading-none">
                THE
                <br />
                CHALLENGE
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <p className="text-sm text-mid-gray leading-relaxed">{project.challenge}</p>
                {gallery[0] && (
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <MediaDisplay item={gallery[0]} alt="Challenge" className="object-cover grayscale" />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Art Direction - red block */}
      <section className="bg-crimson py-20 px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <Reveal>
            <h2 className="font-display font-black text-cream text-4xl md:text-6xl leading-none">
              ART
              <br />
              DIRECTION
            </h2>
          </Reveal>
          {project.solution && (
            <Reveal delay={0.2} className="max-w-sm">
              <p className="text-cream/70 text-sm leading-relaxed">{project.solution}</p>
            </Reveal>
          )}
        </div>
      </section>

      <ProjectGallery items={gallery} title={project.title} />

      {/* Watermark ticker */}
      <div className="bg-cream-dark py-8 overflow-hidden">
        <p
          className="font-display font-black text-charcoal/10 whitespace-nowrap"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
        >
          RADICAL / CURATION / {project.title.toUpperCase()} / RADICAL / CURATION /
        </p>
      </div>

      {/* Back to projects */}
      <div className="bg-cream px-6 md:px-10 py-8">
        <Link
          href="/site/projects"
          className="text-label text-charcoal hover:text-crimson transition-colors flex items-center gap-2"
        >
          BACK TO PROJECTS
        </Link>
      </div>

      <CtaSection />
    </>
  )
}
