/**
 * Generate sample PDF documents for testing
 * Run: node scripts/generate-sample-pdfs.js
 */

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'private', 'docs');

async function generateFloorPlan() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header
  page.drawText('32 NASSIM HILL', {
    x: 50,
    y: 780,
    size: 24,
    font: fontBold,
    color: rgb(0.04, 0.04, 0.04),
  });

  page.drawText('Floor Plans - For Authorized Viewing Only', {
    x: 50,
    y: 750,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Divider
  page.drawLine({
    start: { x: 50, y: 730 },
    end: { x: 545, y: 730 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Floor plan placeholder
  page.drawRectangle({
    x: 50,
    y: 200,
    width: 495,
    height: 500,
    borderColor: rgb(0.7, 0.6, 0.4),
    borderWidth: 2,
  });

  page.drawText('GROUND FLOOR', {
    x: 250,
    y: 450,
    size: 18,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText('[Floor Plan Layout]', {
    x: 230,
    y: 400,
    size: 14,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Footer
  page.drawText('CONFIDENTIAL - Not for distribution', {
    x: 50,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.7, 0.6, 0.4),
  });

  // Add second page
  const page2 = pdfDoc.addPage([595, 842]);
  
  page2.drawText('32 NASSIM HILL', {
    x: 50,
    y: 780,
    size: 24,
    font: fontBold,
    color: rgb(0.04, 0.04, 0.04),
  });

  page2.drawText('Floor Plans - Upper Level', {
    x: 50,
    y: 750,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page2.drawLine({
    start: { x: 50, y: 730 },
    end: { x: 545, y: 730 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  page2.drawRectangle({
    x: 50,
    y: 200,
    width: 495,
    height: 500,
    borderColor: rgb(0.7, 0.6, 0.4),
    borderWidth: 2,
  });

  page2.drawText('UPPER FLOOR', {
    x: 250,
    y: 450,
    size: 18,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  page2.drawText('[Floor Plan Layout]', {
    x: 230,
    y: 400,
    size: 14,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  page2.drawText('CONFIDENTIAL - Not for distribution', {
    x: 50,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.7, 0.6, 0.4),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DOCS_DIR, 'floorplan.pdf'), pdfBytes);
  console.log('✓ Generated floorplan.pdf');
}

async function generateBrochure() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cover page
  const cover = pdfDoc.addPage([595, 842]);
  
  cover.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 842,
    color: rgb(0.04, 0.04, 0.04),
  });

  cover.drawText('32 NASSIM HILL', {
    x: 100,
    y: 500,
    size: 36,
    font: fontBold,
    color: rgb(0.98, 0.98, 0.97),
  });

  cover.drawText('A Private Residence', {
    x: 100,
    y: 460,
    size: 18,
    font: font,
    color: rgb(0.73, 0.59, 0.36),
  });

  cover.drawText('By Invitation Only', {
    x: 100,
    y: 430,
    size: 12,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Property details page
  const page1 = pdfDoc.addPage([595, 842]);

  page1.drawText('THE RESIDENCE', {
    x: 50,
    y: 780,
    size: 24,
    font: fontBold,
    color: rgb(0.04, 0.04, 0.04),
  });

  const details = [
    'Property Type: Good Class Bungalow',
    'Tenure: Freehold',
    'Land Area: 15,000 sq ft',
    'Built-Up Area: 12,000 sq ft',
    'Bedrooms: 6',
    'Bathrooms: 7',
    'Year Built: 2018',
    'Architect: SCDA Architects',
  ];

  details.forEach((detail, i) => {
    page1.drawText(detail, {
      x: 50,
      y: 720 - (i * 30),
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  page1.drawText('CONFIDENTIAL', {
    x: 50,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.73, 0.59, 0.36),
  });

  // Features page
  const page2 = pdfDoc.addPage([595, 842]);

  page2.drawText('FEATURES', {
    x: 50,
    y: 780,
    size: 24,
    font: fontBold,
    color: rgb(0.04, 0.04, 0.04),
  });

  const features = [
    '• Private lift and car park for 4 vehicles',
    '• Infinity pool with city views',
    '• Wine cellar and tasting room',
    '• Home automation system',
    '• Landscaped tropical garden',
    '• Staff quarters',
  ];

  features.forEach((feature, i) => {
    page2.drawText(feature, {
      x: 50,
      y: 720 - (i * 35),
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  page2.drawText('CONFIDENTIAL', {
    x: 50,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.73, 0.59, 0.36),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DOCS_DIR, 'brochure.pdf'), pdfBytes);
  console.log('✓ Generated brochure.pdf');
}

async function main() {
  // Ensure directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  console.log('Generating sample PDFs...\n');
  
  await generateFloorPlan();
  await generateBrochure();
  
  console.log('\n✓ Sample PDFs created in private/docs/');
  console.log('  Replace these with actual property documents.');
}

main().catch(console.error);
