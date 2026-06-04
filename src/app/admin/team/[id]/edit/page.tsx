import { notFound } from 'next/navigation'
import TeamMemberForm from '@/components/admin/TeamMemberForm'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { id: string }
}

async function getTeamMember(id: string) {
  return prisma.teamMember.findUnique({ where: { id } })
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const member = await getTeamMember(params.id)
  if (!member) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Edit Team Member</h1>
        <p className="text-sm text-gray-500 mt-1">{member.name}</p>
      </div>
      <TeamMemberForm member={member} />
    </div>
  )
}
