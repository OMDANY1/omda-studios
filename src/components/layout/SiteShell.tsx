'use client'

import { useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/animations/LoadingScreen'
import PageTransition from '@/components/animations/PageTransition'
import type { About, SiteConfig } from '@/types'

interface SiteShellProps {
  children: React.ReactNode
  about?: About | null
  siteConfig?: SiteConfig | null
}

export default function SiteShell({ children, about, siteConfig }: SiteShellProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  useEffect(() => {
    if (isTouchDevice) return

    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1

      follower.style.left = followerX + 'px'
      follower.style.top = followerY + 'px'

      requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      cursor.classList.add('is-hovering')
      follower.classList.add('is-hovering')
    }

    const onMouseLeaveLink = () => {
      cursor.classList.remove('is-hovering')
      follower.classList.remove('is-hovering')
    }

    document.addEventListener('mousemove', onMouseMove)

    animate()

    const addLinkListeners = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
    }

    addLinkListeners()

    const observer = new MutationObserver(addLinkListeners)

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [isTouchDevice])

  return (
    <div className="site-cursor">
      <LoadingScreen siteName={siteConfig?.siteName} />

      {!isTouchDevice && (
        <>
          <div className="cursor" ref={cursorRef} />
          <div className="cursor-follower" ref={followerRef} />
        </>
      )}

      <Navbar siteName={siteConfig?.siteName} />

      <PageTransition>
        <main>{children}</main>
      </PageTransition>

      <Footer about={about} siteConfig={siteConfig} />
    </div>
  )
}
