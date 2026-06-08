import { getAbout } from '@/lib/cms'
import { getSiteConfig } from '@/lib/cms'
import { buildSiteMetadata } from '@/lib/seo'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import ContactForm from '@/components/contact/ContactForm'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return buildSiteMetadata(siteConfig, { title: 'About', path: '/site/about' })
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const about = await getAbout()

  if (!about) {
    return (
      <section className="bg-cream min-h-screen pt-24 px-6 md:px-10 pb-20">
        <div className="text-center py-20 border border-charcoal/10">
          <p className="text-label text-light-gray">About content coming soon.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-cream pt-24 pb-0 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <Reveal>
            <div>
              {about.headline && (
                <h1
                  className="font-display font-black text-crimson leading-none whitespace-pre-line"
                  style={{ fontSize: 'clamp(4rem, 13vw, 10rem)' }}
                >
                  {about.headline}
                </h1>
              )}
              {about.tagline && (
                <p className="text-label text-light-gray mt-4">ROLE: {about.tagline}</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-zinc-200">
                {about.image ? (
                  <Image src={about.image} alt={about.headline} fill className="object-cover grayscale" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
                )}
              </div>
              {(about.estYear || about.location) && (
                <div className="absolute bottom-4 right-4 bg-cream px-4 py-2">
                  <p className="text-label text-charcoal">
                    {about.estYear && `EST. ${about.estYear}`}
                    {about.estYear && about.location && ' - '}
                    {about.location?.split('/')[0]?.trim()}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20">
        {about.philosophy && (
          <Reveal>
            <p className="text-label text-light-gray mb-8">PHILOSOPHIES</p>
          </Reveal>
        )}

        {about.description && (
          <Reveal delay={0.1}>
            <p className="font-body text-2xl md:text-4xl text-charcoal leading-snug max-w-3xl mb-16">
              {about.description}
            </p>
          </Reveal>
        )}

        {(about.approach1 || about.approach2) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {about.approach1 && (
              <Reveal delay={0.2}>
                <div>
                  <p className="text-label text-crimson mb-3">APPROACH 01</p>
                  <p className="text-sm text-mid-gray leading-relaxed">{about.approach1}</p>
                </div>
              </Reveal>
            )}
            {about.approach2 && (
              <Reveal delay={0.3}>
                <div>
                  <p className="text-label text-crimson mb-3">APPROACH 02</p>
                  <p className="text-sm text-mid-gray leading-relaxed">{about.approach2}</p>
                </div>
              </Reveal>
            )}
          </div>
        )}
      </section>

      <section className="bg-cream px-6 md:px-10 py-20" id="contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div>
              <h2 className="font-display font-black text-4xl md:text-6xl text-charcoal leading-none mb-8">
                GET IN
                <br />
                TOUCH
              </h2>
              <div className="space-y-6">
                {about.email && (
                  <div>
                    <p className="text-label text-light-gray mb-1">ELECTRONIC MAIL</p>
                    <a
                      href={`mailto:${about.email}`}
                      className="font-bold text-charcoal hover:text-crimson transition-colors break-all"
                    >
                      {about.email.toUpperCase()}
                    </a>
                  </div>
                )}
                {about.location && (
                  <div>
                    <p className="text-label text-light-gray mb-1">CURRENT LOCATION</p>
                    <p className="font-bold text-charcoal">{about.location.toUpperCase()}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
