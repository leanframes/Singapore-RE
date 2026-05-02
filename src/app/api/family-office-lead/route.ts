import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { propertyConfig, consultantConfig } from '@/config/property';

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY || '');

interface FOLeadEntry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  timestamp: string;
  ip: string;
  buyerName?: string;
  buyerEmail?: string;
}

interface FOLeadsLog {
  leads: FOLeadEntry[];
}

async function appendFOLead(entry: FOLeadEntry): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'fo_leads.json');
    
    let log: FOLeadsLog = { leads: [] };
    
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
    
    log.leads.push(entry);
    await fs.writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
  } catch {
    // Silently fail in serverless environments where filesystem is read-only
    console.warn('[family-office-lead] Could not write to fo_leads.json - filesystem may be read-only');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get buyer info from NDA cookie
    let buyerName = '';
    let buyerEmail = '';
    const ndaCookie = cookies().get('nda_signed');
    if (ndaCookie?.value) {
      try {
        const decoded = Buffer.from(ndaCookie.value, 'base64').toString('utf-8');
        const ndaData = JSON.parse(decoded);
        buyerName = ndaData.name || '';
        buyerEmail = ndaData.email || '';
      } catch {
        // Ignore cookie parse errors
      }
    }

    const entry: FOLeadEntry = {
      id: `fo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
      ip,
      buyerName,
      buyerEmail,
    };

    await appendFOLead(entry);

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const recipientEmail = process.env.FAMILY_OFFICE_PARTNER_EMAIL || 
                            process.env.CONSULTANT_EMAIL || 
                            consultantConfig.email;

      try {
        await getResend().emails.send({
          from: 'Private Property Portal <noreply@resend.dev>',
          to: recipientEmail,
          subject: `[${propertyConfig.ref}] 🔥 PRIORITY: Family Office Inquiry`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #B9975B;">Family Office / 13O Eligibility Inquiry</h2>
              <p style="color: #ff6b6b; font-weight: bold;">HIGH PRIORITY LEAD</p>
              <p><strong>Property:</strong> ${propertyConfig.ref}</p>
              <hr style="border: 1px solid #eee;" />
              <p><strong>Inquiry Details:</strong></p>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
                ${message ? `<li><strong>Message:</strong> ${message}</li>` : ''}
              </ul>
              <hr style="border: 1px solid #eee;" />
              <p><strong>Viewer (NDA Signed):</strong></p>
              <ul>
                <li><strong>Name:</strong> ${buyerName || 'Unknown'}</li>
                <li><strong>Email:</strong> ${buyerEmail || 'Unknown'}</li>
              </ul>
              <hr style="border: 1px solid #eee;" />
              <p style="color: #666; font-size: 12px;">
                This client is actively viewing the Singapore Sovereignty briefing and has requested a Family Office consultation. Contact within 2 SGT business hours.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send FO lead email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Family office lead error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
