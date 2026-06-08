'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'PROJECTS', href: '/projects' },
  { label: 'BLOG', href: '/blog' },
  { label: 'TEAM', href: '/team' },
  { label: 'TESTIMONIALS', href: '/testimonials' },
  { label: 'CONTACT', href: '/contact' },
]

interface NavbarProps {
  siteName?: string | null
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Navbar({ siteName }: NavbarProps) {
  const logoText = siteName?.replace(/\s/g, '').toUpperCase() || 'OMDASTUDIOS'
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-expo-out ${
          scrolled ? 'bg-cream/92 backdrop-blur-md border-b border-charcoal/5' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between section-padding h-14 md:h-16">
          <Link
            href="/site"
            className="font-display font-bold text-sm tracking-[0.15em] text-charcoal hover:text-crimson transition-colors duration-500"
          >
            {logoText}
          </Link>

          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-label relative py-1 transition-all duration-500 ${
                    active
                      ? 'text-crimson'
                      : 'text-charcoal hover:text-crimson hover:tracking-[0.28em]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-crimson"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:flex items-center bg-crimson text-cream text-label px-6 py-3 hover:bg-crimson-800 transition-colors duration-500"
            >
              INQUIRY
            </Link>

            <button
              className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2 min-w-[44px] min-h-[44px]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.span
                className="block w-6 h-px bg-charcoal origin-center"
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="block w-4 h-px bg-charcoal ml-auto"
                animate={menuOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block w-6 h-px bg-charcoal origin-center"
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-cream"
          >
            <nav
              className="flex flex-col justify-center section-padding pt-20 gap-2 h-full"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, i) => {
                const active = isActive(pathname, item.href)
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.06 + 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={`block font-display font-black text-4xl sm:text-5xl py-3 transition-colors duration-500 ${
                        active ? 'text-crimson' : 'text-charcoal hover:text-crimson'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  className="inline-block bg-crimson text-cream text-label px-10 py-4 min-h-[48px]"
                >
                  INQUIRY
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
