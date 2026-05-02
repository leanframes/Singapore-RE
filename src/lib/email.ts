import { Resend } from 'resend';
import { consultantConfig, propertyConfig } from '@/config/property';

const resend = new Resend(process.env.RESEND_API_KEY);

interface NDANotificationParams {
  viewerName: string;
  viewerEmail: string;
  viewerCompany?: string;
  timestamp: string;
}

export async function sendNDANotificationToConsultant(params: NDANotificationParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Private Property Portal <noreply@resend.dev>',
      to: process.env.CONSULTANT_EMAIL || consultantConfig.email,
      subject: `[${propertyConfig.ref}] New NDA Signed - ${params.viewerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #B9975B;">New Confidentiality Agreement Signed</h2>
          <p><strong>Property:</strong> ${propertyConfig.ref}</p>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Viewer Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${params.viewerName}</li>
            <li><strong>Email:</strong> ${params.viewerEmail}</li>
            ${params.viewerCompany ? `<li><strong>Company:</strong> ${params.viewerCompany}</li>` : ''}
            <li><strong>Signed At:</strong> ${params.timestamp}</li>
          </ul>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            This viewer now has access to watermarked documents. All downloads will be logged and traceable.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send consultant notification:', error);
  }
}

export async function sendNDAConfirmationToViewer(params: NDANotificationParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Private Property Portal <noreply@resend.dev>',
      to: params.viewerEmail,
      subject: `Access Granted - ${propertyConfig.ref}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #B9975B;">Access Granted</h2>
          <p>Dear ${params.viewerName},</p>
          <p>Your access to <strong>${propertyConfig.ref}</strong> has been confirmed.</p>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Important Notice:</strong></p>
          <ul>
            <li>All documents are watermarked with your identity</li>
            <li>Your viewing activity is logged for security purposes</li>
            <li>This information is strictly confidential</li>
          </ul>
          <hr style="border: 1px solid #eee;" />
          <p>For any inquiries, please contact your property consultant:</p>
          <p>
            <strong>${consultantConfig.name}</strong><br />
            ${consultantConfig.agency}<br />
            ${consultantConfig.email}
          </p>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            CEA No: ${consultantConfig.ceaNo}
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send viewer confirmation:', error);
  }
}

interface LeadNotificationParams {
  name: string;
  email: string;
  phone?: string;
  viewingDate?: string;
  source: string;
}

export async function sendLeadNotification(params: LeadNotificationParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Private Property Portal <noreply@resend.dev>',
      to: process.env.CONSULTANT_EMAIL || consultantConfig.email,
      subject: `[${propertyConfig.ref}] New Viewing Request - ${params.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #B9975B;">New Private Viewing Request</h2>
          <p><strong>Property:</strong> ${propertyConfig.ref}</p>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Lead Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${params.name}</li>
            <li><strong>Email:</strong> ${params.email}</li>
            ${params.phone ? `<li><strong>Phone:</strong> ${params.phone}</li>` : ''}
            ${params.viewingDate ? `<li><strong>Preferred Date:</strong> ${params.viewingDate}</li>` : ''}
            <li><strong>Source:</strong> ${params.source}</li>
          </ul>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            Please respond within 24 hours.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send lead notification:', error);
  }
}
