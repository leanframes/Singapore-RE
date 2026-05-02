import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ONE_DAY = 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const adminCode = process.env.ADMIN_CODE;

    if (!adminCode) {
      console.error('ADMIN_CODE environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (code === adminCode) {
      cookies().set('admin_access', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_DAY,
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid code' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
