import Link from 'next/link'
import type { About, SiteConfig } from '@/types'

interface FooterProps {
  about?: About | null
  siteConfig?: SiteConfig | null
}

export default function Footer({ about, siteConfig }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const siteName = siteConfig?.siteName?.replace(/\s/g, '').toUpperCase() || 'OMDASTUDIOS'

  const socialLinks = [
    about?.instagram ? { label: 'INSTAGRAM', href: about.instagram } : null,
    about?.linkedin ? { label: 'LINKEDIN', href: about.linkedin } : null,
    about?.behance ? { label: 'BEHANCE', href: about.behance } : null,
    about?.email ? { label: 'EMAIL', href: `mailto:${about.email}` } : null,
  ].filter((link): link is { label: string; href: string } => link !== null)

  return (
    <footer className="bg-charcoal text-cream/60 section-padding py-10 md:py-12 border-t border-cream/5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span className="font-display font-bold text-sm tracking-[0.15em] text-cream">
          {siteName}
        </span>

        {socialLinks.length > 0 && (
          <nav className="flex flex-wrap items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="text-label text-cream/50 hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <p className="text-label text-cream/30">
          (c){currentYear} {siteName}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
