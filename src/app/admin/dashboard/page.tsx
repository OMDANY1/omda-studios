import Link from 'next/link'
import { ArrowRight, Briefcase, FolderOpen, HardDrive, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getDashboardStats() {
  const [projects, services, unreadMessages, media] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.message.count({ where: { status: 'UNREAD' } }),
    prisma.media.count(),
  ])

  return [
    {
      label: 'Projects',
      value: projects,
      href: '/admin/projects',
      icon: FolderOpen,
      tone: 'bg-crimson/10 text-crimson',
    },
    {
      label: 'Services',
      value: services,
      href: '/admin/services',
      icon: Briefcase,
      tone: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages,
      href: '/admin/messages',
      icon: MessageSquare,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Media Files',
      value: media,
      href: '/admin/media',
      icon: HardDrive,
      tone: 'bg-emerald-50 text-emerald-600',
    },
  ]
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your studio content and activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-lg border border-gray-100 bg-white p-5 transition-colors hover:border-crimson/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest text-gray-400">{stat.label.toUpperCase()}</p>
                  <p className="mt-3 text-3xl font-bold text-charcoal">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs tracking-widest text-gray-400 transition-colors group-hover:text-crimson">
                OPEN
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-6">
        <h2 className="text-sm font-bold tracking-wide text-charcoal">Quick Actions</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 bg-crimson px-5 py-3 text-xs tracking-widest text-cream transition-colors hover:bg-crimson-800"
          >
            NEW PROJECT
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 px-5 py-3 text-xs tracking-widest text-gray-500 transition-colors hover:border-charcoal hover:text-charcoal"
          >
            UPLOAD MEDIA
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
