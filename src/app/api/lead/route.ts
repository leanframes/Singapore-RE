import { NextRequest, NextResponse } from 'next/server';
import { appendLead } from '@/lib/data';
import { sendLeadNotification } from '@/lib/email';

function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, viewingDate, source = 'calendly' } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const propertyRef = process.env.PROPERTY_REF || 'Unknown Property';
    const timestamp = new Date().toISOString();

    // Create lead entry
    const lead = {
      id: generateId(),
      name,
      email,
      phone,
      viewingDate,
      source: source as 'calendly' | 'contact_form' | 'whatsapp',
      timestamp,
      propertyRef,
    };

    // Append to leads log
    await appendLead(lead);

    // Send notification to consultant
    await sendLeadNotification({
      name,
      email,
      phone,
      viewingDate,
      source,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// Calendly webhook handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Calendly webhook payload
    const { event, payload } = body;
    
    if (event === 'invitee.created') {
      const invitee = payload?.invitee;
      const scheduledEvent = payload?.scheduled_event;
      
      const lead = {
        id: generateId(),
        name: invitee?.name || 'Unknown',
        email: invitee?.email || '',
        phone: invitee?.questions_and_answers?.find((q: any) => 
          q.question?.toLowerCase().includes('phone')
        )?.answer,
        viewingDate: scheduledEvent?.start_time,
        source: 'calendly' as const,
        timestamp: new Date().toISOString(),
        propertyRef: process.env.PROPERTY_REF || 'Unknown Property',
        notes: `Calendly event: ${scheduledEvent?.name}`,
      };

      await appendLead(lead);

      await sendLeadNotification({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        viewingDate: lead.viewingDate,
        source: 'Calendly Booking',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
