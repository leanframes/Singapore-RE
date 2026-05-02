'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const PAGE_NAMES: Record<string, string> = {
  '/private/home': 'The Residence',
  '/private/gallery': 'Gallery',
  '/private/documents': 'Documents',
  '/private/viewing': 'Private Viewing',
};

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

export function usePageTracking() {
  const pathname = usePathname();
  const enterTimeRef = useRef<number>(Date.now());
  const currentPageRef = useRef<string>('');
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const sendTrackingEvent = useCallback(async (
    action: 'enter' | 'leave' | 'heartbeat',
    page: string,
    duration?: number
  ) => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    // Extract page path without locale
    const pagePath = page.replace(/^\/(en|zh|id)/, '') || '/private/home';
    const pageName = PAGE_NAMES[pagePath] || pagePath;

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          page: pagePath,
          pageName,
          action,
          duration,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Silently fail - don't interrupt user experience
    }
  }, []);

  useEffect(() => {
    // Clear any existing heartbeat
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }

    // Send leave event for previous page
    if (currentPageRef.current && currentPageRef.current !== pathname) {
      const duration = Math.round((Date.now() - enterTimeRef.current) / 1000);
      sendTrackingEvent('leave', currentPageRef.current, duration);
    }

    // Update refs
    currentPageRef.current = pathname;
    enterTimeRef.current = Date.now();

    // Send enter event for new page
    sendTrackingEvent('enter', pathname);

    // Set up heartbeat every 30 seconds to track ongoing engagement
    heartbeatRef.current = setInterval(() => {
      const duration = Math.round((Date.now() - enterTimeRef.current) / 1000);
      sendTrackingEvent('heartbeat', pathname, duration);
    }, 30000);

    // Cleanup on unmount or page change
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [pathname, sendTrackingEvent]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - enterTimeRef.current) / 1000);
      // Use sendBeacon for reliable delivery on page unload
      const sessionId = getSessionId();
      if (sessionId && currentPageRef.current) {
        const pagePath = currentPageRef.current.replace(/^\/(en|zh|id)/, '') || '/private/home';
        const pageName = PAGE_NAMES[pagePath] || pagePath;
        navigator.sendBeacon('/api/track', JSON.stringify({
          sessionId,
          page: pagePath,
          pageName,
          action: 'leave',
          duration,
          timestamp: new Date().toISOString(),
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}
