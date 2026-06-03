import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'

export const metadata: Metadata = {
  title: 'About',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getAbout() {
  return prisma.about.findFirst()
}

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-24 pb-0 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Big heading */}
          <Reveal>
            <div>
              <h1
                className="font-display font-black text-crimson leading-none"
                style={{ fontSize: 'clamp(4rem, 13vw, 10rem)' }}
              >
                {about?.headline || 'THE\nCURATOR'}
              </h1>
              <p className="text-label text-light-gray mt-4">
                ROLE: {about?.tagline || 'ART DIRECTOR & DIGITAL ARCHITECT'}
              </p>
            </div>
          </Reveal>

          {/* Right: Portrait */}
          <Reveal delay={0.2}>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-zinc-200">
                {about?.image ? (
                  <Image src={about.image} alt={about.headline} fill className="object-cover grayscale" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-cream px-4 py-2">
                <p className="text-label text-charcoal">
                  EST. {about?.estYear || '2018'} - {about?.location?.split('/')[0]?.trim() || 'LONDON'}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-cream px-6 md:px-10 py-20">
        <Reveal>
          <p className="text-label text-light-gray mb-8">PHILOSOPHIES</p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-body text-2xl md:text-4xl text-charcoal leading-snug max-w-3xl mb-16">
            {about?.description ||
              'OMDASTUDIOS is a digital sanctuary where radical minimalism meets visceral impact.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Reveal delay={0.2}>
            <div>
              <p className="text-label text-crimson mb-3">APPROACH 01</p>
              <p className="text-sm text-mid-gray leading-relaxed">
                {about?.approach1 ||
                  'Every pixel serves a purpose. We reject the clutter of traditional UI to allow the typography to act as the primary architectural element of the user experience.'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div>
              <p className="text-label text-crimson mb-3">APPROACH 02</p>
              <p className="text-sm text-mid-gray leading-relaxed">
                {about?.approach2 ||
                  'Physicality in digital spaces. By utilizing tonal shifts instead of borders, we create a sense of depth that feels like stacked fine paper.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Big CTA red block */}
      <section className="bg-crimson py-24 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-display font-black text-cream/5 whitespace-nowrap"
            style={{ fontSize: 'clamp(6rem, 20vw, 18rem)' }}
          >
            OMDA
          </span>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="font-display font-black text-cream text-4xl md:text-6xl lg:text-7xl leading-none mb-4">
            LET&apos;S BUILD THE
            <br />
            IMPOSSIBLE.
          </h2>
          <p className="text-label text-cream/50 mt-6">SCROLL TO CONTACT </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-cream px-6 md:px-10 py-20" id="contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <Reveal>
            <div>
              <h2 className="font-display font-black text-4xl md:text-6xl text-charcoal leading-none mb-8">
                GET IN
                <br />
                TOUCH
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-label text-light-gray mb-1">ELECTRONIC MAIL</p>
                  <a
                    href={`mailto:${about?.email || 'hello@omdastudios.com'}`}
                    className="font-bold text-charcoal hover:text-crimson transition-colors"
                  >
                    {(about?.email || 'hello@omdastudios.com').toUpperCase()}
                  </a>
                </div>
                <div>
                  <p className="text-label text-light-gray mb-1">CURRENT LOCATION</p>
                  <p className="font-bold text-charcoal">
                    {(about?.location || 'London, UK / Remote').toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Contact Form */}
          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}

function ContactForm() {
  return (
    <form className="space-y-6" action="/api/messages" method="POST">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-label text-light-gray block mb-1">NAME</label>
          <input name="name" type="text" placeholder="Your Name" className="form-input" required />
        </div>
        <div>
          <label className="text-label text-light-gray block mb-1">EMAIL</label>
          <input name="email" type="email" placeholder="Your Email" className="form-input" required />
        </div>
      </div>
      <div>
        <label className="text-label text-light-gray block mb-1">SUBJECT</label>
        <select name="subject" className="form-input">
          <option>NEW PROJECT</option>
          <option>COLLABORATION</option>
          <option>GENERAL INQUIRY</option>
        </select>
      </div>
      <div>
        <label className="text-label text-light-gray block mb-1">MESSAGE</label>
        <textarea name="message" rows={4} placeholder="What's on your mind?" className="form-input resize-none" required />
      </div>
      <button
        type="submit"
        className="flex items-center gap-3 bg-crimson text-cream text-label px-8 py-4 hover:bg-crimson-800 transition-colors w-full justify-center"
      >
        SEND MESSAGE
      </button>
    </form>
  )
}
