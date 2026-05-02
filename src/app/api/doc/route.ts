import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWatermarkedPDF } from '@/lib/pdf';
import { appendDownload } from '@/lib/data';
import { NDASignedCookie } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'File parameter required' },
        { status: 400 }
      );
    }

    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Check NDA signed cookie
    const ndaCookie = cookies().get('nda_signed');
    
    if (!ndaCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'NDA not signed' },
        { status: 403 }
      );
    }

    let ndaData: NDASignedCookie;
    try {
      const decoded = Buffer.from(ndaCookie.value, 'base64').toString('utf-8');
      ndaData = JSON.parse(decoded);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 403 }
      );
    }

    const propertyRef = process.env.PROPERTY_REF || 'Unknown Property';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Generate watermarked PDF
    const pdfBytes = await getWatermarkedPDF(filename, {
      viewerName: ndaData.name,
      viewerEmail: ndaData.email,
      propertyRef,
    });

    // Log the download
    await appendDownload({
      filename,
      viewerName: ndaData.name,
      viewerEmail: ndaData.email,
      timestamp: new Date().toISOString(),
      ip,
      propertyRef,
    });

    // Return the PDF with appropriate headers
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Document delivery error:', error);
    
    if ((error as any)?.code === 'ENOENT') {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
