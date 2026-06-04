import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import type { TeamMember } from '@prisma/client'

interface PageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getMember(id: string) {
  try {
    return await fetchApi<TeamMember>(`/api/team/${id}`)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = await getMember(params.id)
  if (!member) return {}
  return { title: member.name, description: member.bio ?? member.role }
}

export default async function TeamMemberPage({ params }: PageProps) {
  const member = await getMember(params.id)
  if (!member) notFound()

  return (
    <>
      <section className="bg-cream pt-28 px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-200">
              {member.image ? (
                <Image src={member.image} alt={member.name} fill className="object-cover grayscale" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-500">
                  <span className="font-display font-black text-8xl text-charcoal/30">
                    {member.name[0]}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <p className="text-label text-light-gray mb-4">TEAM MEMBER</p>
              <h1
                className="font-display font-black text-charcoal leading-none mb-4"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
              >
                {member.name.toUpperCase()}
              </h1>
              <p className="text-label text-crimson mb-8">{member.role.toUpperCase()}</p>
              {member.bio && (
                <p className="text-sm md:text-base text-mid-gray leading-relaxed max-w-lg">{member.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-charcoal/10">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-label text-charcoal hover:text-crimson transition-colors"
                  >
                    EMAIL
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label text-charcoal hover:text-crimson transition-colors"
                  >
                    LINKEDIN
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label text-charcoal hover:text-crimson transition-colors"
                  >
                    INSTAGRAM
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="bg-cream-dark px-6 md:px-10 py-8">
        <Link href="/team" className="text-label text-charcoal hover:text-crimson transition-colors">
          BACK TO TEAM
        </Link>
      </div>

      <CtaSection />
    </>
  )
}
