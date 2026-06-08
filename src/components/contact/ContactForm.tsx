'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    if (data.website) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success("Message sent! We'll be in touch.")
        form.reset()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-label text-light-gray block mb-2">NAME</label>
          <input name="name" type="text" placeholder="YOUR NAME" className="form-input" required minLength={2} maxLength={100} />
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
          minLength={10}
          maxLength={5000}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-3 bg-crimson text-cream text-label px-8 py-4 w-full hover:bg-crimson-800 transition-colors disabled:opacity-60"
      >
        {loading ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}
