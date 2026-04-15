import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const token: string | undefined = request.cookies.get('token')?.value;
  const { pathname }: { pathname: string } = request.nextUrl;
  
  const protectedPaths: string[] = ['/dashboard', '/products', '/categories'];
  const isProtected: boolean = protectedPaths.some(path => pathname.startsWith(path));
  
  
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config: { matcher: string[] } = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/categories/:path*', '/login']
};