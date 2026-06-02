import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  FolderOpen,
  MessageSquare,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'

async function getStats() {
  const [projects, messages, team, posts, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.message.count(),
    prisma.teamMember.count(),
    prisma.blogPost.count(),
    prisma.message.count({ where: { status: 'UNREAD' } }),
  ])
  return { projects, messages, team, posts, unreadMessages }
}

async function getRecentMessages() {
  return prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

export default async function DashboardPage() {
  const [stats, recentMessages] = await Promise.all([getStats(), getRecentMessages()])

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'bg-crimson' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, href: '/admin/messages', color: 'bg-charcoal', badge: stats.unreadMessages },
    { label: 'Team Members', value: stats.team, icon: Users, href: '/admin/team', color: 'bg-zinc-700' },
    { label: 'Blog Posts', value: stats.posts, icon: FileText, href: '/admin/blog', color: 'bg-zinc-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to OMDA Studios admin.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-crimson/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {card.badge ? (
                  <span className="bg-crimson text-cream text-xs px-2 py-0.5 rounded-full">
                    {card.badge} new
                  </span>
                ) : null}
              </div>
              <p className="text-3xl font-black font-display text-charcoal">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-charcoal text-sm tracking-wide">RECENT MESSAGES</h2>
          <Link href="/admin/messages" className="text-crimson text-xs tracking-wider hover:underline flex items-center gap-1">
            VIEW ALL <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentMessages.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">No messages yet.</p>
          ) : (
            recentMessages.map((msg) => (
              <div key={msg.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50">
                <div>
                  <p className="text-sm font-semibold text-charcoal">{msg.name}</p>
                  <p className="text-xs text-gray-400">{msg.email}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-sm">{msg.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      msg.status === 'UNREAD'
                        ? 'bg-crimson/10 text-crimson'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {msg.status}
                  </span>
                  <p className="text-xs text-gray-300">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
