import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'blogforge_admin';

export function middleware(request: NextRequest) {
 const url = request.nextUrl;

 // Allow public routes
 if (!url.pathname.startsWith('/admin')) {
 return NextResponse.next();
 }

 // Allow login page
 if (url.pathname === '/admin/login') {
 return NextResponse.next();
 }

 // Allow all /api/admin/* endpoints (auth, check, dashboard, jobs, etc.)
 if (url.pathname.startsWith('/api/admin/')) {
 return NextResponse.next();
 }

 // Check httpOnly cookie server-side
 const session = request.cookies.get(COOKIE)?.value || '';
 if (!session) {
 return NextResponse.redirect(new URL('/admin/login', url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: ['/admin', '/admin/:path*'],
};
