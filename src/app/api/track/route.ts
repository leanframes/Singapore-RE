import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAnalytics, updateVisitor } from '@/lib/data';
import { NDASignedCookie, VisitorEntry } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, page, pageName, action, duration } = await request.json();

    if (!sessionId || !page || !action) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Get visitor info from NDA cookie
    const ndaCookie = cookies().get('nda_signed');
    let name = 'Anonymous';
    let email = '';
    let ndaSigned = false;

    if (ndaCookie) {
      try {
        const decoded: NDASignedCookie = JSON.parse(Buffer.from(ndaCookie.value, 'base64').toString());
        name = decoded.name;
        email = decoded.email;
        ndaSigned = true;
      } catch {}
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();

    // Get existing analytics
    const analytics = await getAnalytics();
    let visitor = analytics.visitors.find(v => v.sessionId === sessionId);

    if (!visitor) {
      // Create new visitor entry
      visitor = {
        sessionId,
        visitorId: email || sessionId,
        name,
        email,
        ip,
        userAgent,
        firstVisit: timestamp,
        lastVisit: timestamp,
        pagesViewed: [],
        pageViews: [],
        totalTimeSpent: 0,
        ndaSigned,
        documentsViewed: [],
      };
    }

    // Update visitor data based on action
    visitor.lastVisit = timestamp;
    visitor.name = name || visitor.name;
    visitor.email = email || visitor.email;
    visitor.ndaSigned = ndaSigned || visitor.ndaSigned;

    if (action === 'enter') {
      // Add page to viewed list if not already there
      if (!visitor.pagesViewed.includes(page)) {
        visitor.pagesViewed.push(page);
      }
      // Start a new page view entry
      visitor.pageViews.push({
        page,
        pageName: pageName || page,
        enterTime: timestamp,
        duration: 0,
      });
    } else if (action === 'leave' || action === 'heartbeat') {
      // Update the duration of the current page view
      const currentPageView = visitor.pageViews
        .filter(pv => pv.page === page)
        .sort((a, b) => new Date(b.enterTime).getTime() - new Date(a.enterTime).getTime())[0];
      
      if (currentPageView && duration) {
        currentPageView.duration = duration;
      }

      // Recalculate total time spent
      visitor.totalTimeSpent = visitor.pageViews.reduce((sum, pv) => sum + pv.duration, 0);
    }

    await updateVisitor(visitor);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track' }, { status: 500 });
  }
}
