import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next()
    }

    if (pathname.startsWith('/admin') && !token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        if (pathname.startsWith('/admin/login')) {
          return true
        }

        if (pathname.startsWith('/admin')) {
          return Boolean(token)
        }

        return true
      }
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
