import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

async function getTeam() {
  return prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
}

export default async function AdminTeamPage() {
  const team = await getTeam()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">{team.length} members</p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD MEMBER
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="aspect-[3/2] bg-gray-100 relative">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">{member.name[0]}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-charcoal">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
              {member.bio && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{member.bio}</p>}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/team/${member.id}/edit`}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-charcoal transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>
            </div>
          </div>
        ))}

        {team.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <p className="text-gray-400 text-sm">No team members yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
