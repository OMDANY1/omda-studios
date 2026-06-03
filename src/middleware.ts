import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    // Redirect /admin to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/admin/login',
    },
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect /admin routes
        if (req.nextUrl.pathname.startsWith('/admin') &&
            !req.nextUrl.pathname.startsWith('/admin/login')) {
          return !!token
        }
        return true
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
