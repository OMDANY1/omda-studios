import SiteShell from '@/components/layout/SiteShell'
import { getSiteContext } from '@/lib/cms'
import { buildOrganizationJsonLd } from '@/lib/seo'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { about, siteConfig } = await getSiteContext()
  const jsonLd = buildOrganizationJsonLd(siteConfig, about)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteShell about={about} siteConfig={siteConfig}>
        {children}
      </SiteShell>
    </>
  )
}
