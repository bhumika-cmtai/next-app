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
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/','/login', '/register', '/forgot-password'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    const from = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?from=${from}`, request.url)
    );
  }

  return NextResponse.next();
}
