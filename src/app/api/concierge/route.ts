import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { propertyConfig, consultantConfig } from '@/config/property';

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY || '');

const CONCIERGE_TYPES = {
  wealth: 'Wealth Structuring Specialist',
  education: 'Education Admission Consultant',
  medical: 'Medical Concierge',
  security: 'Security Consultant',
};

interface ConciergeRequest {
  id: string;
  type: string;
  typeName: string;
  buyerName: string;
  buyerEmail: string;
  timestamp: string;
  ip: string;
}

interface ConciergeLog {
  requests: ConciergeRequest[];
}

async function appendConciergeRequest(entry: ConciergeRequest): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'concierge_requests.json');
  
  let log: ConciergeLog = { requests: [] };
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    log = JSON.parse(data);
  } catch {
    // File doesn't exist
  }
  
  log.requests.push(entry);
  await fs.writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    
    if (!type || !CONCIERGE_TYPES[type as keyof typeof CONCIERGE_TYPES]) {
      return NextResponse.json(
        { success: false, error: 'Invalid concierge type' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get buyer info from NDA cookie
    let buyerName = 'Unknown';
    let buyerEmail = 'Unknown';
    const ndaCookie = cookies().get('nda_signed');
    if (ndaCookie?.value) {
      try {
        const decoded = Buffer.from(ndaCookie.value, 'base64').toString('utf-8');
        const ndaData = JSON.parse(decoded);
        buyerName = ndaData.name || 'Unknown';
        buyerEmail = ndaData.email || 'Unknown';
      } catch {
        // Ignore cookie parse errors
      }
    }

    const typeName = CONCIERGE_TYPES[type as keyof typeof CONCIERGE_TYPES];

    const entry: ConciergeRequest = {
      id: `conc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      typeName,
      buyerName,
      buyerEmail,
      timestamp: new Date().toISOString(),
      ip,
    };

    await appendConciergeRequest(entry);

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const recipientEmail = process.env.CONCIERGE_EMAIL || 
                            process.env.CONSULTANT_EMAIL || 
                            consultantConfig.email;

      try {
        await getResend().emails.send({
          from: 'Private Property Portal <noreply@resend.dev>',
          to: recipientEmail,
          subject: `[${propertyConfig.ref}] Concierge Request: ${typeName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #B9975B;">Private Concierge Request</h2>
              <p><strong>Property:</strong> ${propertyConfig.ref}</p>
              <hr style="border: 1px solid #eee;" />
              <p><strong>Service Requested:</strong></p>
              <p style="font-size: 18px; color: #B9975B;">${typeName}</p>
              <hr style="border: 1px solid #eee;" />
              <p><strong>Client Details:</strong></p>
              <ul>
                <li><strong>Name:</strong> ${buyerName}</li>
                <li><strong>Email:</strong> ${buyerEmail}</li>
              </ul>
              <hr style="border: 1px solid #eee;" />
              <p style="color: #ff6b6b; font-weight: bold;">
                Priority Lead - Contact within 2 SGT business hours.
              </p>
              <p style="color: #666; font-size: 12px;">
                This client is actively viewing ${propertyConfig.ref} and has requested concierge assistance.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send concierge email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Concierge request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
