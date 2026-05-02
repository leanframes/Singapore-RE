'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { propertyConfig } from '@/config/property';

export default function SelectBriefingPage() {
  const t = useTranslations('selectBriefing');
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelection = async (buyerType: 'global' | 'local') => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/buyer-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerType }),
      });

      if (response.ok) {
        router.push(`/${locale}/private/home`);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to set buyer type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Custom cursor effect for briefing pages */}
      <style jsx global>{`
        body {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%23B9975B' fill-opacity='0.6'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23B9975B'/%3E%3C/svg%3E") 12 12, auto;
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
            {t('classification')}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-foreground/60 text-sm max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Global Family Relocation */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onMouseEnter={() => setHoveredCard('global')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelection('global')}
            disabled={isLoading}
            className={`group relative p-8 md:p-12 border transition-all duration-500 text-left ${
              hoveredCard === 'global'
                ? 'border-gold bg-gold/5'
                : 'border-foreground/10 hover:border-foreground/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Gold shimmer on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 transition-opacity duration-500 ${
              hoveredCard === 'global' ? 'opacity-100' : 'opacity-0'
            }`} />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 mb-6 border border-gold/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-3">
                {t('global.title')}
              </h2>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                {t('global.subtitle')}
              </p>

              {/* Features */}
              <ul className="space-y-2 text-sm text-foreground/50">
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('global.feature1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('global.feature2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('global.feature3')}
                </li>
              </ul>

              {/* Arrow */}
              <div className={`mt-8 flex items-center gap-2 text-gold transition-transform duration-300 ${
                hoveredCard === 'global' ? 'translate-x-2' : ''
              }`}>
                <span className="text-sm tracking-wider uppercase">{t('enterBriefing')}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.button>

          {/* Singapore Citizen/PR */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onMouseEnter={() => setHoveredCard('local')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelection('local')}
            disabled={isLoading}
            className={`group relative p-8 md:p-12 border transition-all duration-500 text-left ${
              hoveredCard === 'local'
                ? 'border-gold bg-gold/5'
                : 'border-foreground/10 hover:border-foreground/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Gold shimmer on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 transition-opacity duration-500 ${
              hoveredCard === 'local' ? 'opacity-100' : 'opacity-0'
            }`} />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 mb-6 border border-gold/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-3">
                {t('local.title')}
              </h2>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                {t('local.subtitle')}
              </p>

              {/* Features */}
              <ul className="space-y-2 text-sm text-foreground/50">
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('local.feature1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('local.feature2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">—</span>
                  {t('local.feature3')}
                </li>
              </ul>

              {/* Arrow */}
              <div className={`mt-8 flex items-center gap-2 text-gold transition-transform duration-300 ${
                hoveredCard === 'local' ? 'translate-x-2' : ''
              }`}>
                <span className="text-sm tracking-wider uppercase">{t('enterBriefing')}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-foreground/30 text-xs mt-12"
        >
          {t('footerNote')}
        </motion.p>
      </motion.div>
    </div>
  );
}
