'use client'

import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { LogOut, Bell } from 'lucide-react'

interface AdminTopBarProps {
  user?: Session['user'] | null
}

export default function AdminTopBar({ user }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <p className="font-display text-lg font-black tracking-tight text-charcoal md:hidden">
          OMDA
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 text-right">
            <p className="text-xs font-semibold text-gray-800">{user?.name || 'Admin'}</p>
            <p className="max-w-[9rem] truncate text-xs text-gray-400 sm:max-w-xs">{user?.email}</p>
          </div>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-crimson text-xs font-bold text-cream">
            {user?.name?.[0] || 'A'}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          type="button"
          aria-label="Sign out"
          title="Sign out"
          className="ml-1 flex items-center gap-1.5 text-gray-400 transition-colors hover:text-red-600 sm:ml-2"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
