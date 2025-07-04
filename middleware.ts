import { NextRequest, NextResponse } from 'next/server';

// Protect all dashboard and resources routes (including subroutes)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/resources/:path*',
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  let user = null;
  try {
    user = token ? JSON.parse(decodeURIComponent(token)) : null;
  } catch {}

  // Role-based route protection
  const isAdminRoute = pathname.startsWith('/dashboard/admin');
  const isTeamRoute = pathname.startsWith('/dashboard/team');
  const isUserRoute = pathname.startsWith('/dashboard/user');

  if (user) {
    if (user.role === 'admin' && (isTeamRoute || isUserRoute)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
    if (user.role === 'team' && (isAdminRoute || isUserRoute)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
    if (user.role === 'user' && (isAdminRoute || isTeamRoute)) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // On login, redirect to correct dashboard for all roles
  if (pathname.startsWith("/login") && user) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    if (user.role === "team") {
      return NextResponse.redirect(new URL("/dashboard/team", request.url));
    }
    if (user.role === "user") {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
  }

  return NextResponse.next();
}
