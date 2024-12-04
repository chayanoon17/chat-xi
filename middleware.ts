import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { JWT } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get the token from the request
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
  }) as JWT | null // Type assertion to specify that user is of type JWT

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // If the pathname starts with /protected and the user is not authenticated, redirect to the home page
  if (pathname.startsWith('/protected') && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request if the user is authenticated or the route is not protected
  return NextResponse.next()
}
