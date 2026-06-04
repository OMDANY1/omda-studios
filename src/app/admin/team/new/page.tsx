import TeamMemberForm from '@/components/admin/TeamMemberForm'

export default function NewTeamMemberPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">New Team Member</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new team profile</p>
      </div>
      <TeamMemberForm />
    </div>
  )
}
