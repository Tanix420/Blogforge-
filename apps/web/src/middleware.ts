import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'blogforge_admin';

export function middleware(request: NextRequest) {
 const url = request.nextUrl;

 // Allow health checks and public routes
 if (!url.pathname.startsWith('/admin')) {
  return NextResponse.next();
 }

 // Allow the login page itself
 if (url.pathname === '/admin/login') {
  return NextResponse.next();
 }

 // Allow auth API endpoint
 if (url.pathname.startsWith('/api/admin/auth')) {
  return NextResponse.next();
 }

 // All other /admin routes require the cookie
 const session = request.cookies.get(COOKIE)?.value || '';
 if (!session) {
  return NextResponse.redirect(new URL('/admin/login', url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: ['/admin/:path*'],
};
