import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appendNDASubmission } from '@/lib/data';
import { sendNDANotificationToConsultant, sendNDAConfirmationToViewer } from '@/lib/email';
import { formatSGT } from '@/lib/date';
import { NDASignedCookie } from '@/types';

const NINETY_DAYS = 90 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { name, email, company } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();
    const propertyRef = process.env.PROPERTY_REF || 'Unknown Property';

    // Append to NDA log
    await appendNDASubmission({
      name,
      email,
      company,
      ip,
      timestamp,
      userAgent,
      propertyRef,
    });

    const formattedTimestamp = formatSGT(timestamp, 'dd MMM yyyy, HH:mm');

    // Send email notifications (async, don't block response)
    Promise.all([
      sendNDANotificationToConsultant({
        viewerName: name,
        viewerEmail: email,
        viewerCompany: company,
        timestamp: formattedTimestamp,
      }),
      sendNDAConfirmationToViewer({
        viewerName: name,
        viewerEmail: email,
        timestamp: formattedTimestamp,
      }),
    ]).catch(console.error);

    // Set the NDA signed cookie
    const ndaData: NDASignedCookie = {
      name,
      email,
      signedAt: timestamp,
    };
    
    const encoded = Buffer.from(JSON.stringify(ndaData)).toString('base64');
    
    cookies().set('nda_signed', encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: NINETY_DAYS,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('NDA submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
