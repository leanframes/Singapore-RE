'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { propertyConfig } from '@/config/property';

export default function GatePage() {
  const t = useTranslations('gate');
  const locale = useLocale();
  const router = useRouter();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to buyer type selection before NDA
        router.push(`/${locale}/select-briefing`);
        router.refresh();
      } else if (response.status === 429) {
        setError(t('tooManyAttempts'));
      } else {
        setError(t('invalidCode'));
      }
    } catch {
      setError(t('invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-foreground/60 text-sm tracking-wide uppercase">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t('placeholder')}
              className="w-full bg-transparent border border-foreground/20 rounded-none px-4 py-4 text-center text-lg tracking-[0.3em] text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none transition-colors"
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={!code || isLoading}
            className="w-full bg-gold hover:bg-gold-light text-background py-4 text-sm tracking-widest uppercase font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : t('enterButton')}
          </button>
        </form>

        <p className="text-center text-foreground/40 text-xs mt-8">
          {t('contactConsultant')}
        </p>

        <div className="mt-12 text-center">
          <p className="text-foreground/20 text-xs">
            {propertyConfig.ref}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
