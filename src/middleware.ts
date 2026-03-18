import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths under /admin or /api/admin that do not require a session cookie
const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/api/admin/oauth/start',
  '/api/admin/oauth/callback',
  '/api/admin/login', // returns 410; keep accessible without a session
];

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter for the OAuth start endpoint.
// Edge middleware runs per-isolate, so this is not distributed across all
// Netlify edge nodes, but provides meaningful protection per node against
// rapid repeated OAuth initiation attempts.
// ---------------------------------------------------------------------------
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX = 10; // max requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return false;
  }

  if (entry.count >= RL_MAX) return true;
  entry.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate-limit OAuth initiation to slow abuse
  if (pathname === '/api/admin/oauth/start') {
    const ip =
      request.headers.get('x-nf-client-connection-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown';
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': '60' },
      });
    }
  }

  // Public paths pass through unauthenticated
  if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // All other /admin/* and /api/admin/* require a session cookie.
  // Full HMAC + expiry + username verification still happens inside each
  // route/page; this middleware is a fast pre-filter at the edge.
  const session = request.cookies.get('admin_session');
  if (!session?.value) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
