'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GlobalSovereigntyBriefing from '@/components/GlobalSovereigntyBriefing';
import ProvenanceBriefing from '@/components/ProvenanceBriefing';

function BriefingContent() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buyerType, setBuyerType] = useState<'global' | 'local' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First check URL param (from DevModeToggle)
    const modeParam = searchParams.get('mode');
    if (modeParam === 'local' || modeParam === 'global') {
      console.log('[Briefing] Using URL param mode:', modeParam);
      setBuyerType(modeParam);
      setIsLoading(false);
      return;
    }

    // Fallback to cookie
    const match = document.cookie.match(/(?:^| )buyer_type=([^;]+)/);
    const cookieValue = match ? match[1] : null;
    console.log('[Briefing] Cookie buyer_type:', cookieValue);
    
    if (cookieValue === 'local') {
      setBuyerType('local');
    } else {
      setBuyerType('global');
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleComplete = async () => {
    try {
      await fetch('/api/briefing-complete', {
        method: 'POST',
      });
      router.push(`/${locale}/private/home`);
      router.refresh();
    } catch (error) {
      console.error('Failed to mark briefing complete:', error);
      router.push(`/${locale}/private/home`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-foreground/50 text-sm tracking-wider uppercase">Initializing Briefing</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {buyerType === 'global' ? (
        <GlobalSovereigntyBriefing onComplete={handleComplete} />
      ) : (
        <ProvenanceBriefing onComplete={handleComplete} />
      )}
    </motion.div>
  );
}

export default function BriefingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border border-gold rounded-full flex items-center justify-center mx-auto">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <BriefingContent />
    </Suspense>
  );
}
