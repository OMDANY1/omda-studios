import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OMDA Studios — Art Direction & Digital Craft',
    template: '%s | OMDA Studios',
  },
  description:
    'A curation of visual narratives where editorial precision meets raw brutalist expression. We build digital monographs for the bold.',
  keywords: ['art direction', 'digital design', 'visual identity', 'branding', 'editorial'],
  authors: [{ name: 'OMDA Studios' }],
  creator: 'OMDA Studios',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://omdastudios.com',
    siteName: 'OMDA Studios',
    title: 'OMDA Studios — Art Direction & Digital Craft',
    description:
      'A curation of visual narratives where editorial precision meets raw brutalist expression.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMDA Studios',
    description: 'Art Direction & Digital Craft',
  },
  robots: {
    index: true,
    follow: true,
  },
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
