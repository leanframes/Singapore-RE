import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic - no caching
export const dynamic = 'force-dynamic';

const NINETY_DAYS = 90 * 24 * 60 * 60;

export async function GET() {
  try {
    const buyerTypeCookie = cookies().get('buyer_type');
    return NextResponse.json(
      { buyerType: buyerTypeCookie?.value || null },
      { 
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch {
    return NextResponse.json({ buyerType: null });
  }
}

interface BuyerTypeLogEntry {
  buyerType: 'global' | 'local';
  timestamp: string;
  ip: string;
  userAgent: string;
}

interface BuyerTypeLog {
  entries: BuyerTypeLogEntry[];
}

async function appendBuyerTypeLog(entry: BuyerTypeLogEntry): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'buyer_type_log.json');
  
  let log: BuyerTypeLog = { entries: [] };
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    log = JSON.parse(data);
  } catch {
    // File doesn't exist, use default
  }
  
  log.entries.push(entry);
  await fs.writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const { buyerType } = await request.json();
    
    if (!buyerType || !['global', 'local'].includes(buyerType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid buyer type' },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log the selection (best-effort, don't fail if logging fails in serverless env)
    try {
      await appendBuyerTypeLog({
        buyerType,
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
      });
    } catch (logError) {
      console.warn('Failed to log buyer type selection:', logError);
      // Continue - logging failure should not block the user
    }

    // Set the cookie
    cookies().set('buyer_type', buyerType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: NINETY_DAYS,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Buyer type selection error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
