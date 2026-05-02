'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function DigitalScarcityBanner() {
  const t = useTranslations('scarcity');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gold/10 border-b border-gold/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-4 text-center">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gold text-xs uppercase tracking-widest font-medium">
              {t('badge')}
            </span>
          </span>
          <span className="text-foreground/60 text-xs">
            {t('message')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
