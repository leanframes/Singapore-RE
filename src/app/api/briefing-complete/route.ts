import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NINETY_DAYS = 90 * 24 * 60 * 60;

export async function POST() {
  try {
    // Set the briefing_viewed cookie
    cookies().set('briefing_viewed', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: NINETY_DAYS,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Briefing complete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
