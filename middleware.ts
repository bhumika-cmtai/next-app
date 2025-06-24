import { NextRequest, NextResponse } from 'next/server';

// Add matcher for the paths we want to protect
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /examples (inside public)
     * 5. all files inside public (images, fonts, icons, etc)
     * 6. all auth routes (/login, /register, /forgot-password)
     */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+|login|register|forgot-password).*)',
    '/resources/:path*', // Protect all resources paths
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Public paths that don't require authentication
   const alwaysPublicPaths = ['/', '/get-started'];
  
  // If the path is always public, allow access
  if (alwaysPublicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const publicPaths = ['/login', '/register', '/forgot-password'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Check if the path is a protected resource
  const isProtectedResource = pathname.startsWith('/resources/');

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected (including protected resources) and user is not logged in, redirect to login
  if ((!isPublicPath || isProtectedResource) && !token) {
    const from = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?from=${from}`, request.url)
    );
  }

  return NextResponse.next();
}
