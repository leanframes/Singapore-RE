'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface NDAModalProps {
  isOpen: boolean;
  ndaContent: string;
}

export default function NDAModal({ isOpen, ndaContent }: NDAModalProps) {
  const t = useTranslations('nda');
  const locale = useLocale();
  const router = useRouter();
  
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    agreed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Consider scrolled to bottom when within 50px of bottom
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleClose = () => {
    router.push(`/${locale}/gate`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreed) {
      setError(t('agreementRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-background border border-foreground/10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center">
            <h2 className="font-heading text-2xl text-foreground">{t('title')}</h2>
            <button
              onClick={handleClose}
              className="text-foreground/50 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* NDA Content */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-64 overflow-y-auto px-6 py-4 nda-scroll"
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: ndaContent }} />
              </div>
            </div>
            
            {!hasScrolledToBottom && (
              <div className="px-6 py-2 text-center">
                <p className="text-foreground/50 text-xs animate-pulse">
                  ↓ {t('scrollToRead')} ↓
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-foreground/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-foreground/60 mb-1">
                {t('company')} <span className="text-foreground/40">({t('optional') || 'Optional'})</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <label className={`flex items-start gap-3 cursor-pointer ${!hasScrolledToBottom ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                checked={formData.agreed}
                onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                disabled={!hasScrolledToBottom}
                className="mt-1 w-4 h-4 accent-gold"
              />
              <span className="text-sm text-foreground/80">
                {t('agreeText')}
              </span>
            </label>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={!formData.agreed || !formData.name || !formData.email || isLoading}
              className="w-full bg-gold hover:bg-gold-light text-background py-3 text-sm tracking-widest uppercase font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : t('submitButton')}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
