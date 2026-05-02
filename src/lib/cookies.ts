import { cookies } from 'next/headers';
import { NDASignedCookie } from '@/types';

const NINETY_DAYS = 90 * 24 * 60 * 60;

export function setAccessCookie(): void {
  cookies().set('access_granted', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: NINETY_DAYS,
    path: '/',
  });
}

export function getAccessCookie(): boolean {
  const cookie = cookies().get('access_granted');
  return cookie?.value === 'true';
}

export function setNDACookie(name: string, email: string): void {
  const data: NDASignedCookie = {
    name,
    email,
    signedAt: new Date().toISOString(),
  };
  
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  
  cookies().set('nda_signed', encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: NINETY_DAYS,
    path: '/',
  });
}

export function getNDACookie(): NDASignedCookie | null {
  const cookie = cookies().get('nda_signed');
  
  if (!cookie?.value) {
    return null;
  }
  
  try {
    const decoded = Buffer.from(cookie.value, 'base64').toString('utf-8');
    return JSON.parse(decoded) as NDASignedCookie;
  } catch {
    return null;
  }
}

export function setAdminCookie(): void {
  cookies().set('admin_access', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours for admin
    path: '/',
  });
}

export function getAdminCookie(): boolean {
  const cookie = cookies().get('admin_access');
  return cookie?.value === 'true';
}

export function clearAllCookies(): void {
  cookies().delete('access_granted');
  cookies().delete('nda_signed');
  cookies().delete('admin_access');
}
