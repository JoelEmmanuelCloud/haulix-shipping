// middleware.js (Updated for Next.js 15)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/ship'];
  const adminRoutes = ['/admin'];
  
  const pathname = request.nextUrl.pathname;
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Basic token validation (you may want to add JWT verification here)
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        // Add admin role checking logic here if needed
      }
      
      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/ship/:path*'
  ],
};