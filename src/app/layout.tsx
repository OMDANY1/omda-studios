import type { Metadata } from 'next'
import '@/styles/globals.css'
import { getSiteConfig } from '@/lib/cms'
import { buildSiteMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return {
    ...buildSiteMetadata(siteConfig),
    title: {
      default: siteConfig.metaTitle || siteConfig.siteName || 'OMDA Studios',
      template: `%s | ${siteConfig.siteName || 'OMDA Studios'}`,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
