import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import { ArrowUpRight } from 'lucide-react'
import type { TeamMember } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Team',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getTeam() {
  return fetchApi<TeamMember[]>('/api/team')
}

export default async function TeamPage() {
  const team = await getTeam()

  return (
    <>
      <section className="bg-cream pt-28 pb-0 px-6 md:px-10">
        <Reveal>
          <div className="mb-16">
            <h1
              className="font-display font-black leading-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
            >
              <span className="text-charcoal block">THE</span>
              <span className="text-crimson block">COLLECTIVE</span>
            </h1>
            <p className="text-sm text-mid-gray mt-6 max-w-md">
              The minds shaping visual narratives, digital experiences, and editorial craft.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-charcoal/10">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <Link
                href={`/team/${member.id}`}
                className="group block border-b border-r-0 sm:border-r border-charcoal/10"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-500">
                      <span className="font-display font-black text-6xl text-charcoal/30">
                        {member.name[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display font-black text-xl uppercase text-charcoal group-hover:text-crimson transition-colors">
                        {member.name}
                      </h2>
                      <p className="text-label text-mid-gray mt-1">{member.role}</p>
                      {member.bio && (
                        <p className="text-sm text-mid-gray mt-3 line-clamp-2">{member.bio}</p>
                      )}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-crimson opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {team.length === 0 && (
          <Reveal>
            <p className="text-sm text-mid-gray py-20 border-t border-charcoal/10">
              Team profiles coming soon.
            </p>
          </Reveal>
        )}
      </section>

      <CtaSection />
    </>
  )
}
