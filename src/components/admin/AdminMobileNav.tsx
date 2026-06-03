'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNavItems } from '@/components/admin/AdminSidebar'

export default function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/10 bg-charcoal md:hidden">
      <div className="flex min-w-max gap-1 overflow-x-auto px-3 py-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center gap-2 whitespace-nowrap px-3 text-xs tracking-wider transition-colors ${
                isActive
                  ? 'bg-crimson text-cream'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label.toUpperCase()}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
