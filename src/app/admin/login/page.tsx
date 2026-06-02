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
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-cream text-4xl tracking-tight">OMDA</h1>
          <p className="text-light-gray text-xs tracking-widest mt-1">STUDIOS ADMIN</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest text-light-gray mb-2">EMAIL</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-transparent border-b border-white/20 py-3 text-cream text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-white/20"
              placeholder="admin@omdastudios.com"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest text-light-gray mb-2">PASSWORD</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-transparent border-b border-white/20 py-3 text-cream text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-crimson-500 text-xs tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson text-cream py-4 text-xs tracking-widest hover:bg-crimson-600 transition-colors disabled:opacity-60 mt-4"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER STUDIO'}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8">
          ©{new Date().getFullYear()} OMDASTUDIOS
        </p>
      </div>
    </div>
  )
}
