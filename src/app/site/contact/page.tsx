import { getAbout } from '@/lib/cms'
import { buildSiteMetadata } from '@/lib/seo'
import { getSiteConfig } from '@/lib/cms'
import Reveal from '@/components/animations/Reveal'
import ContactForm from '@/components/contact/ContactForm'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return buildSiteMetadata(siteConfig, { title: 'Contact', path: '/site/contact' })
}

export default async function ContactPage() {
  const about = await getAbout()

  return (
    <section className="bg-cream min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div className="max-w-5xl">
        <Reveal>
          <h1
            className="font-display font-black text-charcoal leading-none mb-16"
            style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
          >
            CONTACT
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Reveal delay={0.1}>
            <div className="space-y-8">
              {about?.email && (
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
              {about?.location && (
                <div>
                  <p className="text-label text-light-gray mb-1">CURRENT LOCATION</p>
                  <p className="font-bold text-charcoal">{about.location.toUpperCase()}</p>
                </div>
              )}
              {about?.phone && (
                <div>
                  <p className="text-label text-light-gray mb-1">PHONE</p>
                  <a href={`tel:${about.phone}`} className="font-bold text-charcoal hover:text-crimson transition-colors">
                    {about.phone}
                  </a>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
