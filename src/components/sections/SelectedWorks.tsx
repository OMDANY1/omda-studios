'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/animations/Reveal'
import type { Project } from '@/types'

interface WorksGridProps {
projects: Project[]
}

export default function SelectedWorks({ projects }: WorksGridProps) {
return ( <section className="bg-cream px-6 md:px-10 py-20">
{/* Header */} <div className="flex items-end justify-between mb-12"> <Reveal> <h2 className="font-display font-black text-5xl md:text-7xl text-charcoal leading-none">
SELECTED <br />
WORKS </h2> </Reveal> <Reveal delay={0.2}> <p className="text-label text-light-gray hidden md:block">SCROLL TO EXPLORE →</p> </Reveal> </div>

  {/* Projects grid */}
  <div className="space-y-0">
    {projects.map((project, i) => (
      <ProjectCard key={project.id} project={project} index={i} />
    ))}
  </div>

  {/* View All */}
  <Reveal delay={0.2} className="mt-16 text-center">
    <Link
      href="/site/projects"
      className="inline-flex items-center gap-3 text-label text-charcoal border border-charcoal/20 px-10 py-4 hover:bg-charcoal hover:text-cream transition-all duration-300"
    >
      VIEW ALL PROJECTS
      <ArrowUpRight className="w-3 h-3" />
    </Link>
  </Reveal>
</section>

)
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
const isEven = index % 2 === 0

return (
<Reveal delay={index * 0.05}>
<Link href={`/site/projects/${project.slug}`} className="group block mb-2">
<div className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-end gap-0`}>
{/* Image */} <div className="w-1/2 md:w-2/5 aspect-[4/3] overflow-hidden bg-zinc-200 relative">
{project.coverImage ? ( <Image
             src={project.coverImage}
             alt={project.title}
             fill
             className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
           />
) : ( <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 group-hover:from-zinc-200 transition-all duration-500" />
)}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-label bg-cream/90 px-2 py-1 text-charcoal">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className={`w-1/2 md:w-3/5 ${isEven ? 'pl-6 md:pl-10' : 'pr-6 md:pr-10'} pb-4`}>
        <h3 className="font-display font-black text-2xl md:text-3xl text-charcoal group-hover:text-crimson transition-colors uppercase">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <ArrowUpRight className="w-4 h-4 text-crimson opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>

    {/* Red block accent for certain items */}
    {project.featured && index === 1 && (
      <div className="ml-auto w-1/2 md:w-3/5 h-24 md:h-40 bg-crimson -mt-12 relative z-10">
        <div className="absolute bottom-4 left-4">
          <p className="text-label text-cream/60">FEATURED</p>
        </div>
      </div>
    )}
  </Link>
</Reveal>

)
}
