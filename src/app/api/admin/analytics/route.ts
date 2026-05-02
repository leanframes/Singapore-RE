import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { promises as fs } from 'fs';
import path from 'path';
import { getNDALog, getDownloadLog, getLeads, getAnalytics } from '@/lib/data';

interface BuyerTypeLog {
  entries: { buyerType: 'global' | 'local'; timestamp: string }[];
}

interface ConciergeLog {
  requests: { id: string; type: string; timestamp: string }[];
}

interface FOLeadsLog {
  leads: { id: string; timestamp: string }[];
}

async function readJSON<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminCookie = cookies().get('admin_access');
    if (!adminCookie || adminCookie.value !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const [ndaLog, downloadLog, leads, analytics] = await Promise.all([
      getNDALog(),
      getDownloadLog(),
      getLeads(),
      getAnalytics(),
    ]);

    // Calculate analytics
    const uniqueVisitors = analytics.visitors.length;
    const repeatVisits = analytics.visitors.filter(v => 
      (v.pageViews?.length || 0) > 3
    ).length;
    
    const totalTimeSpent = analytics.visitors.reduce((sum, v) => sum + (v.totalTimeSpent || 0), 0);
    const avgTimeOnSite = uniqueVisitors > 0 
      ? formatDuration(totalTimeSpent / uniqueVisitors)
      : '0s';

    const totalPagesViewed = analytics.visitors.reduce(
      (sum, v) => sum + v.pagesViewed.length, 0
    );

    const stats = {
      uniqueVisitors,
      avgTimeOnSite,
      pagesViewed: totalPagesViewed,
      documentsDownloaded: downloadLog.downloads.length,
      repeatVisits,
      ndaSignatures: ndaLog.submissions.length,
    };

    // Build a map of downloads by email
    const downloadsByEmail = new Map<string, string[]>();
    downloadLog.downloads.forEach(d => {
      const existing = downloadsByEmail.get(d.viewerEmail) || [];
      existing.push(d.filename);
      downloadsByEmail.set(d.viewerEmail, existing);
    });

    // Build detailed visitor activity with page breakdown - deduplicated by email
    const visitorsByEmail = new Map<string, {
      name: string;
      email: string;
      firstVisit: string;
      lastVisit: string;
      totalTime: number;
      pagesViewed: Set<string>;
      pageViews: { page: string; pageName: string; duration: number }[];
      documentsViewed: Set<string>;
    }>();

    analytics.visitors
      .filter(v => v.ndaSigned && v.name && v.name !== 'Anonymous' && v.email)
      .forEach(v => {
        const existing = visitorsByEmail.get(v.email);
        if (existing) {
          // Merge with existing
          existing.totalTime += v.totalTimeSpent || 0;
          v.pagesViewed.forEach(p => existing.pagesViewed.add(p));
          (v.pageViews || []).forEach(pv => existing.pageViews.push(pv));
          (v.documentsViewed || []).forEach(d => existing.documentsViewed.add(d));
          // Update first/last visit
          if (new Date(v.firstVisit) < new Date(existing.firstVisit)) {
            existing.firstVisit = v.firstVisit;
          }
          if (new Date(v.lastVisit) > new Date(existing.lastVisit)) {
            existing.lastVisit = v.lastVisit;
          }
        } else {
          visitorsByEmail.set(v.email, {
            name: v.name,
            email: v.email,
            firstVisit: v.firstVisit,
            lastVisit: v.lastVisit,
            totalTime: v.totalTimeSpent || 0,
            pagesViewed: new Set(v.pagesViewed),
            pageViews: [...(v.pageViews || [])],
            documentsViewed: new Set(v.documentsViewed || []),
          });
        }
      });

    const visitorDetails = Array.from(visitorsByEmail.values())
      .map(v => {
        // Group page views by page and calculate total time per page
        const pageTimeMap = new Map<string, { pageName: string; totalDuration: number }>();
        v.pageViews.forEach(pv => {
          const existing = pageTimeMap.get(pv.page);
          if (existing) {
            existing.totalDuration += pv.duration;
          } else {
            pageTimeMap.set(pv.page, { pageName: pv.pageName, totalDuration: pv.duration });
          }
        });

        const pageBreakdown = Array.from(pageTimeMap.entries())
          .map(([page, data]) => ({
            page,
            pageName: data.pageName,
            duration: data.totalDuration,
            formattedDuration: formatDuration(data.totalDuration),
          }))
          .sort((a, b) => b.duration - a.duration);

        // Merge documents from downloadLog
        const docsFromLog = downloadsByEmail.get(v.email) || [];
        const allDocs = new Set([...v.documentsViewed, ...docsFromLog]);

        return {
          name: v.name,
          email: v.email,
          firstVisit: v.firstVisit,
          lastVisit: v.lastVisit,
          totalTime: v.totalTime,
          formattedTotalTime: formatDuration(v.totalTime),
          pagesViewed: v.pagesViewed.size,
          pageBreakdown,
          documentsViewed: Array.from(allDocs),
        };
      })
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());

    // Recent activity (combined from all sources)
    const recentActivity: { type: string; name: string; email: string; timestamp: string; detail: string }[] = [];

    // Add NDA signatures
    ndaLog.submissions.forEach(s => {
      recentActivity.push({
        type: 'nda',
        name: s.name,
        email: s.email,
        timestamp: s.timestamp,
        detail: 'Signed NDA',
      });
    });

    // Add document downloads
    downloadLog.downloads.forEach(d => {
      recentActivity.push({
        type: 'download',
        name: d.viewerName,
        email: d.viewerEmail,
        timestamp: d.timestamp,
        detail: `Downloaded ${d.filename}`,
      });
    });

    // Add leads
    leads.leads.forEach(l => {
      recentActivity.push({
        type: 'lead',
        name: l.name,
        email: l.email,
        timestamp: l.timestamp,
        detail: `Viewing request via ${l.source}`,
      });
    });

    // Add page views with significant time (> 30 seconds)
    analytics.visitors.forEach(v => {
      if (!v.ndaSigned || !v.pageViews || !v.name) return;
      v.pageViews
        .filter(pv => pv.duration >= 30)
        .forEach(pv => {
          recentActivity.push({
            type: 'pageview',
            name: v.name,
            email: v.email,
            timestamp: pv.enterTime,
            detail: `Spent ${formatDuration(pv.duration)} on ${pv.pageName}`,
          });
        });
    });

    // Sort by timestamp, most recent first
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Get new sovereignty portal analytics
    const [buyerTypeLog, conciergeLog, foLeadsLog] = await Promise.all([
      readJSON<BuyerTypeLog>('buyer_type_log.json', { entries: [] }),
      readJSON<ConciergeLog>('concierge_requests.json', { requests: [] }),
      readJSON<FOLeadsLog>('fo_leads.json', { leads: [] }),
    ]);

    // Count buyer types
    const buyerTypes = {
      global: buyerTypeLog.entries.filter(e => e.buyerType === 'global').length,
      local: buyerTypeLog.entries.filter(e => e.buyerType === 'local').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      recentActivity: recentActivity.slice(0, 50),
      visitorDetails,
      ndaSubmissions: ndaLog.submissions,
      downloads: downloadLog.downloads,
      leads: leads.leads,
      buyerTypes,
      conciergeRequests: conciergeLog.requests.length,
      foLeads: foLeadsLog.leads.length,
      briefingCompletion: Math.round((analytics.visitors.filter(v => v.ndaSigned).length / Math.max(analytics.visitors.length, 1)) * 100),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
