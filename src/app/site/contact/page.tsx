'use client'

import { useState } from 'react'
import Reveal from '@/components/animations/Reveal'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Message sent! We\'ll be in touch.')
        form.reset()
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
              <div>
                <p className="text-label text-light-gray mb-1">ELECTRONIC MAIL</p>
                <a href="mailto:hello@omdastudios.com" className="font-bold text-charcoal hover:text-crimson transition-colors">
                  HELLO@OMDASTUDIOS.COM
                </a>
              </div>
              <div>
                <p className="text-label text-light-gray mb-1">CURRENT LOCATION</p>
                <p className="font-bold text-charcoal">LONDON, UK / REMOTE</p>
              </div>
              <div className="pt-8">
                <p className="text-sm text-mid-gray leading-relaxed max-w-sm">
                  Whether you have a new project, a question, or just want to say hello — we&apos;d
                  love to hear from you.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-label text-light-gray block mb-2">NAME</label>
                  <input name="name" type="text" placeholder="YOUR NAME" className="form-input" required />
                </div>
                <div>
                  <label className="text-label text-light-gray block mb-2">EMAIL</label>
                  <input name="email" type="email" placeholder="YOUR EMAIL" className="form-input" required />
                </div>
              </div>
              <div>
                <label className="text-label text-light-gray block mb-2">SUBJECT</label>
                <select name="subject" className="form-input">
                  <option>NEW PROJECT</option>
                  <option>COLLABORATION</option>
                  <option>GENERAL INQUIRY</option>
                  <option>OTHER</option>
                </select>
              </div>
              <div>
                <label className="text-label text-light-gray block mb-2">MESSAGE</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="WHAT'S ON YOUR MIND?"
                  className="form-input resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-crimson text-cream text-label px-8 py-4 w-full hover:bg-crimson-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE →'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
