import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

async function getAbout() {
  return prisma.about.findFirst()
}

export default async function AdminSettingsPage() {
  const about = await getAbout()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your about section and site info</p>
      </div>
      <SettingsForm about={about} />
    </div>
  )
}
