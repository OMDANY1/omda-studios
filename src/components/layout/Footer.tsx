import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-cream/60 px-6 md:px-10 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Logo */}
        <span className="font-display font-bold text-sm tracking-[0.15em] text-cream">
          OMDASTUDIOS
        </span>

        {/* Social Links */}
        <nav className="flex items-center gap-6">
          {[
            { label: 'INSTAGRAM', href: '#' },
            { label: 'LINKEDIN', href: '#' },
            { label: 'BEHANCE', href: '#' },
            { label: 'EMAIL', href: 'mailto:hello@omdastudios.com' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label text-cream/50 hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-label text-cream/30">
          (c){currentYear} OMDASTUDIOS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
