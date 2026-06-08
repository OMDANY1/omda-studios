'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/animations/Reveal'
import MediaDisplay from '@/components/ui/MediaDisplay'
import { mergeProjectGallery, type MediaItem } from '@/lib/media'
import type { Project } from '@/types'

interface WorksGridProps {
  projects: Project[]
  title?: string | null
  subtitle?: string | null
}

function projectPreviewMedia(project: Project): MediaItem | null {
  if (project.coverImage) {
    return { url: project.coverImage, type: 'image' }
  }
  const gallery = mergeProjectGallery(project.gallery, project.images)
  return gallery[0] ?? null
}

export default function SelectedWorks({ projects, title, subtitle }: WorksGridProps) {
  const displayTitle = title || 'SELECTED\nWORKS'

  return (
    <section className="bg-cream section-spacing section-padding">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-14 md:mb-16">
        <Reveal>
          <h2 className="section-heading text-charcoal whitespace-pre-line">{displayTitle}</h2>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.15}>
            <p className="text-label text-light-gray max-w-xs md:text-right">{subtitle}</p>
          </Reveal>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-charcoal/10">
          <p className="text-label text-light-gray">Projects coming soon.</p>
        </div>
      ) : (
        <div className="space-y-12 md:space-y-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      <Reveal delay={0.15} className="mt-16 md:mt-20 text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-3 text-label text-charcoal border border-charcoal/15 px-10 py-4 min-h-[48px] hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-500 ease-expo-out"
        >
          VIEW ALL PROJECTS
          <ArrowUpRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0
  const preview = projectPreviewMedia(project)
  const gallery = mergeProjectGallery(project.gallery, project.images)
  const hasMultipleMedia = gallery.length > 1

  return (
    <Reveal delay={index * 0.06}>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={`flex flex-col ${
            isEven ? 'md:flex-row' : 'md:flex-row-reverse'
          } items-stretch md:items-end gap-6 md:gap-0`}
        >
          <div className="w-full md:w-2/5 aspect-[4/3] overflow-hidden bg-cream-dark relative">
            {preview ? (
              <MediaDisplay
                item={preview}
                alt={project.title}
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[900ms] ease-expo-out scale-100 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cream-dark to-charcoal/10 transition-all duration-700 group-hover:from-cream group-hover:to-cream-dark" />
            )}

            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-700 pointer-events-none" />

            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {project.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-label bg-cream/90 px-2 py-1 text-charcoal">
                  {tag.toUpperCase()}
                </span>
              ))}
              {hasMultipleMedia && (
                <span className="text-label bg-charcoal/80 text-cream px-2 py-1">
                  +{gallery.length} MEDIA
                </span>
              )}
            </div>
          </div>

          <div
            className={`w-full md:w-3/5 ${
              isEven ? 'md:pl-8 lg:pl-12' : 'md:pr-8 lg:pr-12'
            } pb-2 md:pb-4`}
          >
            <h3 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-charcoal group-hover:text-crimson transition-colors duration-500 uppercase leading-tight">
              {project.title}
            </h3>
            <p className="text-label text-light-gray mt-3">{project.category}</p>
            <div className="flex items-center gap-2 mt-3 overflow-hidden">
              <ArrowUpRight className="w-4 h-4 text-crimson -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-expo-out" />
            </div>
          </div>
        </div>

        {project.featured && index === 1 && (
          <div className="hidden md:block ml-auto w-3/5 h-24 lg:h-36 bg-crimson -mt-10 relative z-10">
            <div className="absolute bottom-4 left-6">
              <p className="text-label text-cream/60">FEATURED</p>
            </div>
          </div>
        )}
      </Link>
    </Reveal>
  )
}
