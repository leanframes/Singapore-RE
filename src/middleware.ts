import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'zh', 'id'];
const defaultLocale = 'en';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

// Rate limiting store (in-memory, resets on cold start)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

function getRateLimitKey(ip: string): string {
  return `rate_limit:${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  
  const record = rateLimitStore.get(key);
  
  if (!record || record.timestamp < hourAgo) {
    rateLimitStore.set(key, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= 5) {
    return true;
  }
  
  record.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle intl first
  const response = intlMiddleware(request);
  
  // Extract locale from pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
  const pathWithoutLocale = pathnameHasLocale 
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;

  // Rate limiting for gate page POST attempts
  if (pathWithoutLocale === '/gate') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (request.method === 'POST' && isRateLimited(ip)) {
      return new NextResponse('Too many attempts. Please try again later.', { 
        status: 429,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  // Protect /select-briefing route - requires access_granted
  if (pathWithoutLocale === '/select-briefing') {
    const accessCookie = request.cookies.get('access_granted');
    
    if (!accessCookie || accessCookie.value !== 'true') {
      const gateUrl = new URL(`/${locale}/gate`, request.url);
      return NextResponse.redirect(gateUrl);
    }
    
    // If already selected buyer type, redirect to private
    const buyerTypeCookie = request.cookies.get('buyer_type');
    if (buyerTypeCookie?.value) {
      const homeUrl = new URL(`/${locale}/private/home`, request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Protect /private routes
  if (pathWithoutLocale.startsWith('/private')) {
    const accessCookie = request.cookies.get('access_granted');
    
    if (!accessCookie || accessCookie.value !== 'true') {
      const gateUrl = new URL(`/${locale}/gate`, request.url);
      return NextResponse.redirect(gateUrl);
    }

    // Check if buyer type has been selected (except for /private/briefing)
    const buyerTypeCookie = request.cookies.get('buyer_type');
    if (!buyerTypeCookie?.value && pathWithoutLocale !== '/private/briefing') {
      // Need to select buyer type first - but only enforce after NDA is signed
      // The NDA modal handles pre-NDA access control
    }

    // Check if briefing has been viewed - redirect to briefing if not
    // (only for pages other than briefing itself, and only if NDA is signed)
    const ndaCookie = request.cookies.get('nda_signed');
    const briefingViewedCookie = request.cookies.get('briefing_viewed');
    
    if (ndaCookie?.value && 
        !briefingViewedCookie?.value && 
        pathWithoutLocale !== '/private/briefing' &&
        pathWithoutLocale.startsWith('/private')) {
      const briefingUrl = new URL(`/${locale}/private/briefing`, request.url);
      return NextResponse.redirect(briefingUrl);
    }
  }

  // Protect /admin routes (except login page)
  if (pathWithoutLocale.startsWith('/admin') && !pathWithoutLocale.startsWith('/admin/login')) {
    const adminCookie = request.cookies.get('admin_access');
    
    if (!adminCookie || adminCookie.value !== 'true') {
      const adminGateUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(adminGateUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
