'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: '/admin/dashboard',
    })

    if (result?.error || !result?.ok) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.replace('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-black tracking-tight text-cream">OMDA</h1>
          <p className="mt-1 text-xs tracking-widest text-light-gray">STUDIOS ADMIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs tracking-widest text-light-gray">EMAIL</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-cream transition-colors placeholder:text-white/20 focus:border-crimson focus:outline-none"
              placeholder="admin@omdastudios.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-widest text-light-gray">PASSWORD</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-cream transition-colors placeholder:text-white/20 focus:border-crimson focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-xs tracking-wider text-crimson-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-crimson py-4 text-xs tracking-widest text-cream transition-colors hover:bg-crimson-600 disabled:opacity-60"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER STUDIO'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/20">
          (c) {new Date().getFullYear()} OMDASTUDIOS
        </p>
      </div>
    </div>
  )
}
