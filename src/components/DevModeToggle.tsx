'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function DevModeToggleContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'global' | 'local'>('global');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current mode from URL param or cookie on mount
  useEffect(() => {
    setMounted(true);
    
    // First check URL param (from switching)
    const modeParam = searchParams.get('mode');
    if (modeParam === 'global' || modeParam === 'local') {
      console.log('[DevMode] Using URL param mode:', modeParam);
      setCurrentMode(modeParam);
      return;
    }
    
    // Fallback to cookie
    const match = document.cookie.match(/(?:^| )buyer_type=([^;]+)/);
    const value = match ? match[1] : null;
    console.log('[DevMode] Cookie buyer_type:', value);
    
    if (value === 'global' || value === 'local') {
      setCurrentMode(value);
    }
  }, [searchParams]);

  const switchMode = (mode: 'global' | 'local') => {
    console.log('[DevMode] Switching to:', mode);
    
    // Set the cookie directly - simpler format for localhost
    document.cookie = `buyer_type=${mode}; path=/`;
    // Clear briefing_viewed to allow re-viewing
    document.cookie = 'briefing_viewed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    console.log('[DevMode] Cookie after set:', document.cookie);
    
    setCurrentMode(mode);
    
    // Get locale from pathname
    const locale = pathname.split('/')[1] || 'en';
    
    // Navigate to briefing page with cache buster
    window.location.href = `/${locale}/private/briefing?mode=${mode}&t=${Date.now()}`;
  };

  // Don't render before mount
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        DEV
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-10 left-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 min-w-[200px]">
          <div className="text-xs text-zinc-400 mb-3 font-mono">Buyer Mode</div>
          
          <div className="space-y-2">
            <button
              onClick={() => switchMode('global')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                currentMode === 'global'
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              🌏 Global (Foreigner)
              <div className="text-xs text-zinc-500 mt-0.5">Sovereignty Briefing</div>
            </button>
            
            <button
              onClick={() => switchMode('local')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                currentMode === 'local'
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              🇸🇬 Local (Singaporean)
              <div className="text-xs text-zinc-500 mt-0.5">Provenance Briefing</div>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-700">
            <button
              onClick={() => {
                document.cookie = 'briefing_viewed=; path=/; max-age=0';
                const locale = pathname.split('/')[1] || 'en';
                window.location.href = `/${locale}/private/briefing`;
              }}
              className="w-full text-center px-3 py-1.5 rounded text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
            >
              ↻ Reset & View Briefing
            </button>
          </div>

          <div className="text-[10px] text-zinc-600 mt-3 text-center">
            Dev-only • Hidden in production
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper with production check and Suspense
export default function DevModeToggle() {
  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DevModeToggleContent />
    </Suspense>
  );
}
