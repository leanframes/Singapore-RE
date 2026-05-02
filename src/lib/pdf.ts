import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { formatSGT } from './date';

const DOCS_DIR = path.join(process.cwd(), 'private', 'docs');

interface WatermarkOptions {
  viewerName: string;
  viewerEmail: string;
  propertyRef: string;
  date?: Date;
}

export async function getWatermarkedPDF(
  filename: string,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const filePath = path.join(DOCS_DIR, filename);
  
  // Read the original PDF
  const existingPdfBytes = await fs.readFile(filePath);
  
  // Load the PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Get all pages
  const pages = pdfDoc.getPages();
  
  const dateStr = formatSGT(options.date || new Date(), 'dd MMM yyyy HH:mm');
  const footerText = `Confidential – Viewed by ${options.viewerName} (${options.viewerEmail}) – ${dateStr} SGT – ${options.propertyRef}`;
  const watermarkText = options.viewerEmail;
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // Add footer watermark
    const footerFontSize = 8;
    const footerTextWidth = helvetica.widthOfTextAtSize(footerText, footerFontSize);
    const footerX = (width - footerTextWidth) / 2;
    
    page.drawText(footerText, {
      x: footerX,
      y: 15,
      size: footerFontSize,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.7,
    });
    
    // Add diagonal watermark
    const watermarkFontSize = 40;
    
    // Calculate diagonal positioning
    const angleDegrees = -30; // -30 degrees
    
    // Draw multiple diagonal watermarks across the page
    const watermarkPositions = [
      { x: width * 0.25, y: height * 0.75 },
      { x: width * 0.75, y: height * 0.75 },
      { x: width * 0.5, y: height * 0.5 },
      { x: width * 0.25, y: height * 0.25 },
      { x: width * 0.75, y: height * 0.25 },
    ];
    
    for (const pos of watermarkPositions) {
      page.drawText(watermarkText, {
        x: pos.x,
        y: pos.y,
        size: watermarkFontSize,
        font: helveticaBold,
        color: rgb(0.85, 0.85, 0.85),
        opacity: 0.15,
        rotate: degrees(angleDegrees),
      });
    }
    
    // Add "CONFIDENTIAL" text in center
    const confidentialText = 'CONFIDENTIAL';
    page.drawText(confidentialText, {
      x: width * 0.35,
      y: height * 0.5,
      size: 60,
      font: helveticaBold,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.08,
      rotate: degrees(angleDegrees),
    });
  }
  
  // Serialize the modified PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function listAvailableDocs(): Promise<string[]> {
  try {
    const files = await fs.readdir(DOCS_DIR);
    return files.filter(f => f.endsWith('.pdf'));
  } catch {
    return [];
  }
}
