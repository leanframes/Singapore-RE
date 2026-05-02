'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const t = useTranslations('admin');
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
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        router.push(`/${locale}/admin`);
        router.refresh();
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
          <h1 className="font-heading text-4xl text-foreground mb-4">
            {t('login')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('loginPlaceholder')}
              className="w-full bg-transparent border border-foreground/20 rounded-none px-4 py-4 text-center text-lg tracking-[0.2em] text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none transition-colors"
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
            {isLoading ? '...' : 'Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
