'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Image,
  Tag,
  Briefcase,
  Users,
  Star,
  MessageSquare,
  FileText,
  HardDrive,
  Settings,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Image },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Media', href: '/admin/media', icon: HardDrive },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-charcoal flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-display font-black text-cream text-xl tracking-tight">OMDA</h1>
        <p className="text-white/30 text-xs tracking-widest mt-0.5">ADMIN STUDIO</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-xs tracking-wider transition-all ${
                isActive
                  ? 'text-cream bg-crimson/20 border-r-2 border-crimson'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label.toUpperCase()}
            </Link>
          )
        })}
      </nav>

      {/* View site */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-white/30 text-xs tracking-wider hover:text-white/60 transition-colors px-2 py-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          VIEW SITE
        </Link>
      </div>
    </aside>
  )
}
