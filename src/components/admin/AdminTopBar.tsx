'use client'

import { signOut } from 'next-auth/react'
import { LogOut, Bell } from 'lucide-react'

interface AdminTopBarProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default function AdminTopBar({ user }: AdminTopBarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between flex-shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="w-8 h-8 bg-crimson rounded-full flex items-center justify-center text-cream text-xs font-bold">
            {user?.name?.[0] || 'A'}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors ml-2"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
