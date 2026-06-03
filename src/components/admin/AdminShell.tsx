'use client'

import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'
import AdminMobileNav from '@/components/admin/AdminMobileNav'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminToaster from '@/components/admin/AdminToaster'
import AdminTopBar from '@/components/admin/AdminTopBar'

interface AdminShellProps {
  children: React.ReactNode
  user?: Session['user'] | null
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <>
        {children}
        <AdminToaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-charcoal md:flex">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex">
        <AdminSidebar />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-56">
        <AdminTopBar user={user} />
        <AdminMobileNav />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <AdminToaster />
    </div>
  )
}
