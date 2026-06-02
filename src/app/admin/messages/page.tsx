import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import MessageActions from '@/components/admin/MessageActions'

async function getMessages() {
  return prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
}

const statusColors: Record<string, string> = {
  UNREAD: 'bg-crimson/10 text-crimson',
  READ: 'bg-blue-50 text-blue-600',
  REPLIED: 'bg-green-50 text-green-700',
  ARCHIVED: 'bg-gray-100 text-gray-400',
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  const unread = messages.filter((m) => m.status === 'UNREAD').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            {messages.length} total · {unread} unread
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 hover:bg-gray-50/50 transition-colors ${
                  msg.status === 'UNREAD' ? 'border-l-2 border-crimson' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <p className="font-semibold text-charcoal text-sm">{msg.name}</p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-gray-400 hover:text-crimson transition-colors"
                      >
                        {msg.email}
                      </a>
                      {msg.subject && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {msg.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-gray-300 mt-2">{formatDate(msg.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[msg.status]}`}>
                      {msg.status}
                    </span>
                    <MessageActions messageId={msg.id} currentStatus={msg.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
