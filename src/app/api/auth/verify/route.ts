import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NINETY_DAYS = 90 * 24 * 60 * 60;

// In-memory rate limiting (resets on cold start)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const key = `auth:${ip}`;
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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts' },
        { status: 429 }
      );
    }

    const { code } = await request.json();
    const propertyCode = process.env.PROPERTY_CODE;

    if (!propertyCode) {
      console.error('PROPERTY_CODE environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (code?.toUpperCase() === propertyCode.toUpperCase()) {
      // Set the access cookie
      cookies().set('access_granted', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: NINETY_DAYS,
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid code' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
