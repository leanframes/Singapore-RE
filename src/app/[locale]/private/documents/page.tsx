'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { propertyConfig } from '@/config/property';

export default function DocumentsPage() {
  const t = useTranslations();

  const handleViewDocument = (filename: string) => {
    // Open PDF in new tab - API will add watermark
    window.open(`/api/doc?file=${encodeURIComponent(filename)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            {t('documents.title')}
          </h1>
          <p className="text-foreground/60">
            {t('documents.subtitle')}
          </p>
        </motion.div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propertyConfig.documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-foreground/10 p-6 hover:border-gold/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-xl text-foreground mb-2">
                    {t(doc.nameKey)}
                  </h3>
                  <p className="text-foreground/50 text-sm">
                    {t('documents.pdfDocument')}
                  </p>
                </div>
                <div className="text-gold">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={() => handleViewDocument(doc.filename)}
                className="mt-6 w-full border border-gold text-gold px-4 py-2 text-sm tracking-wider uppercase hover:bg-gold hover:text-background transition-colors"
              >
                {t('documents.download')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Watermark Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 p-6 bg-foreground/[0.02] border border-foreground/5"
        >
          <div className="flex items-start gap-4">
            <div className="text-gold mt-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-foreground font-medium mb-1">{t('documents.securityNotice')}</h4>
              <p className="text-foreground/60 text-sm">
                {t('documents.securityMessage')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
