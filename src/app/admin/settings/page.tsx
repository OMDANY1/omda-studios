import { prisma } from '@/lib/prisma'
import { getSiteConfig } from '@/lib/cms'
import SettingsForm from '@/components/admin/SettingsForm'
import SiteConfigForm from '@/components/admin/SiteConfigForm'

async function getAbout() {
  return prisma.about.findFirst()
}

export default async function AdminSettingsPage() {
  const [about, siteConfig] = await Promise.all([getAbout(), getSiteConfig()])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage site identity, SEO, about content and contact info</p>
      </div>
      <div className="space-y-12 max-w-3xl">
        <SiteConfigForm siteConfig={siteConfig} />
        <SettingsForm about={about} />
      </div>
    </div>
  )
}
