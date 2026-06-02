'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'PROJECTS', href: '/site/projects' },
  { label: 'ABOUT', href: '/site/about' },
  { label: 'CONTACT', href: '/site/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-14">
          {/* Logo */}
          <Link href="/site" className="font-display font-bold text-sm tracking-[0.15em] text-charcoal hover:text-crimson transition-colors">
            OMDASTUDIOS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-label transition-colors relative ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-crimson'
                    : 'text-charcoal hover:text-crimson'
                }`}
              >
                {item.label}
                {(pathname === item.href || pathname.startsWith(item.href + '/')) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-crimson"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/site/contact"
              className="hidden md:flex items-center bg-crimson text-cream text-label px-5 py-2.5 hover:bg-crimson-800 transition-colors"
            >
              INQUIRY
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-px bg-charcoal"
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-4 h-px bg-charcoal"
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-6 h-px bg-charcoal"
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-cream flex flex-col justify-center px-10"
          >
            <nav className="flex flex-col gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="font-display font-black text-6xl text-charcoal hover:text-crimson transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/site/contact"
                  className="inline-block bg-crimson text-cream text-label px-8 py-4 mt-4"
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
