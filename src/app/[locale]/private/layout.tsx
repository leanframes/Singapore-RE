import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import NDAModal from '@/components/NDAModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTracker from '@/components/PageTracker';
import ConciergeFAB from '@/components/ConciergeFAB';
import DigitalScarcityBanner from '@/components/DigitalScarcityBanner';
import DevModeToggle from '@/components/DevModeToggle';

// Embedded NDA content as fallback for serverless environments
const FALLBACK_NDA_EN = `
<h1>CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h1>
<h2>Property Reference: ${process.env.NEXT_PUBLIC_PROPERTY_REF || 'Private Property'}</h2>
<p>This Confidentiality and Non-Disclosure Agreement ("Agreement") is entered into by and between the property owner's authorized representative and the undersigned viewer ("Recipient").</p>

<h3>1. CONFIDENTIAL INFORMATION</h3>
<p>The Recipient acknowledges that all information, materials, documents, photographs, floor plans, pricing, and any other details relating to the Property ("Confidential Information") are strictly confidential and proprietary.</p>

<h3>2. NON-DISCLOSURE OBLIGATIONS</h3>
<p>The Recipient agrees to:</p>
<ul>
<li>Keep all Confidential Information strictly confidential</li>
<li>Not disclose any Confidential Information to any third party without prior written consent</li>
<li>Not reproduce, copy, or distribute any materials received</li>
<li>Not photograph or record any part of the Property during viewings</li>
<li>Use the Confidential Information solely for evaluating potential acquisition</li>
</ul>

<h3>3. WATERMARKING AND TRACKING</h3>
<p>The Recipient acknowledges and consents that:</p>
<ul>
<li>All digital documents will be watermarked with the Recipient's identity</li>
<li>All access and downloads will be logged with timestamps and IP addresses</li>
<li>This data may be used for security and audit purposes</li>
</ul>

<h3>4. RETURN OF MATERIALS</h3>
<p>Upon request, the Recipient shall promptly return or destroy all Confidential Information received, including any copies made.</p>

<h3>5. DURATION</h3>
<p>This Agreement shall remain in effect for a period of two (2) years from the date of signing, or until the Property is sold, whichever is earlier.</p>

<h3>6. REMEDIES</h3>
<p>The Recipient acknowledges that any breach of this Agreement may cause irreparable harm and that the property owner shall be entitled to seek injunctive relief in addition to any other remedies available at law.</p>

<h3>7. GOVERNING LAW</h3>
<p>This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.</p>

<hr/>
<p><strong>By proceeding, you acknowledge that you have read, understood, and agree to be bound by the terms of this Confidentiality Agreement.</strong></p>
<p>Your access will be logged and all documents will be watermarked for identification and tracking purposes.</p>
`;

async function getNDAContent(locale: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'content', `nda-${locale}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    // Simple markdown to HTML conversion for basic formatting
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/<\/li>\n<li>/gim, '</li><li>')
      .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  } catch {
    // Fallback to English file if locale-specific not found
    try {
      const filePath = path.join(process.cwd(), 'content', 'nda-en.md');
      const content = await fs.readFile(filePath, 'utf-8');
      return content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/<\/li>\n<li>/gim, '</li><li>')
        .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    } catch {
      // Use embedded fallback for serverless environments
      return FALLBACK_NDA_EN;
    }
  }
}

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const ndaCookie = cookies().get('nda_signed');
  const hasSignedNDA = !!ndaCookie?.value;
  const briefingViewedCookie = cookies().get('briefing_viewed');
  const hasBriefingViewed = !!briefingViewedCookie?.value;
  
  const ndaContent = await getNDAContent(locale);

  return (
    <>
      {!hasSignedNDA && <NDAModal isOpen={true} ndaContent={ndaContent} />}
      {hasSignedNDA && (
        <div className="min-h-screen flex flex-col">
          <PageTracker />
          {hasBriefingViewed && <DigitalScarcityBanner />}
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          {hasBriefingViewed && <ConciergeFAB />}
          <DevModeToggle />
        </div>
      )}
    </>
  );
}
