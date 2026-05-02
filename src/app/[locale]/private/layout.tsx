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
    // Fallback to English if locale-specific file not found
    try {
      const filePath = path.join(process.cwd(), 'content', 'nda-en.md');
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch {
      return '<p>Confidentiality agreement content not found.</p>';
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
