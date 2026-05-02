'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { formatDateTime, formatRelativeTime } from '@/lib/date';
import { propertyConfig } from '@/config/property';

interface PageBreakdown {
  page: string;
  pageName: string;
  duration: number;
  formattedDuration: string;
}

interface VisitorDetail {
  name: string;
  email: string;
  firstVisit: string;
  lastVisit: string;
  totalTime: number;
  formattedTotalTime: string;
  pagesViewed: number;
  pageBreakdown: PageBreakdown[];
  documentsViewed: string[];
}

interface ActivityEvent {
  type: string;
  name: string;
  email: string;
  timestamp: string;
  detail: string;
}

interface AnalyticsData {
  stats: {
    uniqueVisitors: number;
    avgTimeOnSite: string;
    pagesViewed: number;
    documentsDownloaded: number;
    repeatVisits: number;
    ndaSignatures: number;
  };
  recentActivity: ActivityEvent[];
  visitorDetails?: VisitorDetail[];
  buyerTypes?: {
    global: number;
    local: number;
  };
  conciergeRequests?: number;
  foLeads?: number;
  briefingCompletion?: number;
}

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorDetail | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.status === 403) {
        router.push(`/${locale}/admin/login`);
        return;
      }
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to load analytics');
      }
    } catch {
      setError('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    // In a real implementation, this would update the PROPERTY_CODE
    // For now, we'll show instructions
    alert('To revoke access, update PROPERTY_CODE in your Vercel environment variables and redeploy.');
    setShowRevokeModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground/50">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
            {t('title')}
          </h1>
          <p className="text-foreground/50">{propertyConfig.ref}</p>
        </motion.div>

        {/* Key Stats - Only 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-foreground/[0.02] border border-foreground/5 p-6 text-center">
            <p className="text-3xl md:text-4xl font-heading text-gold">
              {data?.stats?.ndaSignatures || 0}
            </p>
            <p className="text-foreground/50 text-sm mt-2">Interested Buyers</p>
          </div>
          <div className="bg-foreground/[0.02] border border-foreground/5 p-6 text-center">
            <p className="text-3xl md:text-4xl font-heading text-gold">
              {data?.stats?.avgTimeOnSite || '0s'}
            </p>
            <p className="text-foreground/50 text-sm mt-2">Avg. Time</p>
          </div>
        </motion.div>

        {/* New: Sovereignty Portal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-foreground/[0.02] border border-foreground/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground/50 text-xs uppercase tracking-wider">{t('globalBuyers')}</span>
              <span className="w-2 h-2 rounded-full bg-gold"></span>
            </div>
            <p className="text-2xl font-heading text-foreground">{data?.buyerTypes?.global || 0}</p>
          </div>
          <div className="bg-foreground/[0.02] border border-foreground/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground/50 text-xs uppercase tracking-wider">{t('localBuyers')}</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <p className="text-2xl font-heading text-foreground">{data?.buyerTypes?.local || 0}</p>
          </div>
          <div className="bg-foreground/[0.02] border border-foreground/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground/50 text-xs uppercase tracking-wider">{t('foLeads')}</span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <p className="text-2xl font-heading text-foreground">{data?.foLeads || 0}</p>
          </div>
          <div className="bg-foreground/[0.02] border border-foreground/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground/50 text-xs uppercase tracking-wider">{t('conciergeRequests')}</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <p className="text-2xl font-heading text-foreground">{data?.conciergeRequests || 0}</p>
          </div>
        </motion.div>

        {/* Buyers List - Clickable Table */}
        {data?.visitorDetails && data.visitorDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-heading text-xl text-foreground mb-4">
              Buyers List <span className="text-foreground/40 text-sm font-normal">({data.visitorDetails.length})</span>
            </h2>
            <div className="bg-foreground/[0.02] border border-foreground/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left text-foreground/50 text-xs uppercase tracking-wider p-4">Name</th>
                    <th className="text-left text-foreground/50 text-xs uppercase tracking-wider p-4 hidden sm:table-cell">Email</th>
                    <th className="text-center text-foreground/50 text-xs uppercase tracking-wider p-4">Time</th>
                    <th className="text-right text-foreground/50 text-xs uppercase tracking-wider p-4">Most Viewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {data.visitorDetails.map((visitor, index) => {
                    const topPage = visitor.pageBreakdown[0];
                    return (
                      <tr 
                        key={index} 
                        onClick={() => setSelectedVisitor(visitor)}
                        className="hover:bg-foreground/[0.04] cursor-pointer transition-colors"
                      >
                        <td className="p-4">
                          <p className="text-foreground font-medium">{visitor.name}</p>
                          <p className="text-foreground/40 text-xs sm:hidden">{visitor.email}</p>
                        </td>
                        <td className="p-4 text-foreground/60 text-sm hidden sm:table-cell">{visitor.email}</td>
                        <td className="p-4 text-center">
                          <span className="text-gold font-medium">{visitor.formattedTotalTime}</span>
                        </td>
                        <td className="p-4 text-right">
                          {topPage ? (
                            <div className="text-right">
                              <p className="text-foreground/80 text-sm">{topPage.pageName}</p>
                              <p className="text-gold text-xs">{topPage.formattedDuration}</p>
                            </div>
                          ) : (
                            <span className="text-foreground/30">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Recent Key Events - Condensed */}
        {data?.recentActivity && data.recentActivity.filter(a => a.type === 'nda' || a.type === 'download').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="font-heading text-xl text-foreground mb-4">Key Events</h2>
            <div className="space-y-2">
              {data.recentActivity
                .filter(a => a.type === 'nda' || a.type === 'download')
                .slice(0, 5)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-foreground/[0.02] border border-foreground/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        activity.type === 'nda' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-foreground">{activity.name}</span>
                      <span className="text-foreground/40 text-sm">{activity.detail}</span>
                    </div>
                    <span className="text-foreground/40 text-xs">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => setShowRevokeModal(true)}
            className="px-6 py-3 border border-red-500/50 text-red-400 text-sm tracking-wider uppercase hover:bg-red-500/10 transition-colors"
          >
            {t('revokeAccess')}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 border border-foreground/20 text-foreground/50 text-sm tracking-wider uppercase hover:border-foreground/40 transition-colors"
          >
            {t('deleteSuite')}
          </button>
        </motion.div>

        {/* Revoke Modal */}
        {showRevokeModal && (
          <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4">
            <div className="bg-background border border-foreground/10 p-6 max-w-md">
              <h3 className="font-heading text-xl text-foreground mb-4">
                {t('revokeAccess')}
              </h3>
              <p className="text-foreground/70 text-sm mb-6">
                {t('revokeConfirm')}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="flex-1 py-2 border border-foreground/20 text-foreground/70 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  className="flex-1 py-2 bg-red-500 text-white text-sm"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Instructions Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4">
            <div className="bg-background border border-foreground/10 p-6 max-w-lg">
              <h3 className="font-heading text-xl text-foreground mb-4">
                {t('deleteInstructions')}
              </h3>
              <div className="text-foreground/70 text-sm space-y-4 mb-6">
                <p>To completely remove this property suite:</p>
                <ol className="list-decimal list-inside space-y-2 text-foreground/60">
                  <li>Go to your Vercel Dashboard</li>
                  <li>Select this project</li>
                  <li>Go to Settings → General</li>
                  <li>Scroll to "Delete Project"</li>
                  <li>Confirm deletion</li>
                  <li>Remove any custom domains</li>
                </ol>
                <p className="text-foreground/40 text-xs">
                  All data including NDA logs, download records, and analytics will be permanently deleted.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2 border border-foreground/20 text-foreground/70 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Buyer Detail Dialog */}
        <AnimatePresence>
          {selectedVisitor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-sm"
                onClick={() => setSelectedVisitor(null)}
              />
              
              {/* Dialog */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="relative w-full max-w-lg max-h-[85vh] bg-background border border-foreground/10 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex-shrink-0 border-b border-foreground/10 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-xl text-foreground">{selectedVisitor.name}</h3>
                      <p className="text-foreground/50 text-sm mt-1">{selectedVisitor.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedVisitor(null)}
                      className="text-foreground/40 hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-foreground/[0.03] border border-foreground/5 p-3 text-center">
                      <p className="text-xl font-heading text-gold">{selectedVisitor.formattedTotalTime}</p>
                      <p className="text-foreground/50 text-xs mt-1">Total Time</p>
                    </div>
                    <div className="bg-foreground/[0.03] border border-foreground/5 p-3 text-center">
                      <p className="text-xl font-heading text-gold">{selectedVisitor.pagesViewed}</p>
                      <p className="text-foreground/50 text-xs mt-1">Pages Viewed</p>
                    </div>
                    <div className="bg-foreground/[0.03] border border-foreground/5 p-3 text-center">
                      <p className="text-xl font-heading text-gold">{selectedVisitor.documentsViewed?.length || 0}</p>
                      <p className="text-foreground/50 text-xs mt-1">Docs Downloaded</p>
                    </div>
                  </div>

                  {/* Visit Timeline */}
                  <div className="flex gap-4 text-xs text-foreground/50 border-b border-foreground/5 pb-4">
                    <span>First: {formatRelativeTime(selectedVisitor.firstVisit)}</span>
                    <span>•</span>
                    <span>Last: {formatRelativeTime(selectedVisitor.lastVisit)}</span>
                  </div>

                  {/* Time per Page */}
                  {selectedVisitor.pageBreakdown.length > 0 && (
                    <div>
                      <h4 className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Time per Page</h4>
                      <div className="space-y-1">
                        {selectedVisitor.pageBreakdown.map((page, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-foreground/[0.02] px-3 py-2"
                          >
                            <span className="text-foreground text-sm">{page.pageName}</span>
                            <span className="text-gold text-sm font-medium">{page.formattedDuration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents Viewed */}
                  {selectedVisitor.documentsViewed && selectedVisitor.documentsViewed.length > 0 && (
                    <div>
                      <h4 className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Documents Viewed</h4>
                      <div className="space-y-1">
                        {selectedVisitor.documentsViewed.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-foreground/70 text-sm"
                          >
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Events for this buyer */}
                  {data?.recentActivity && (() => {
                    const buyerEvents = data.recentActivity.filter(
                      (a: ActivityEvent) => a.email === selectedVisitor.email && (a.type === 'nda' || a.type === 'download' || a.type === 'pageview')
                    );
                    if (buyerEvents.length === 0) return null;
                    return (
                      <div>
                        <h4 className="text-foreground/50 text-xs uppercase tracking-wider mb-2">Key Events</h4>
                        <div className="space-y-1">
                          {buyerEvents.slice(0, 8).map((event: ActivityEvent, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-foreground/[0.02] px-3 py-2"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                event.type === 'nda' ? 'bg-green-500' : 
                                event.type === 'download' ? 'bg-blue-500' : 'bg-gold'
                              }`} />
                              <span className="text-foreground/70 text-sm flex-1">{event.detail}</span>
                              <span className="text-foreground/40 text-xs">{formatRelativeTime(event.timestamp)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
