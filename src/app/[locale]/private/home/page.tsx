'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { propertyConfig, consultantConfig } from '@/config/property';
import { useLocale } from 'next-intl';

export default function PrivateHomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-background">
          {/* Hero Image from Unsplash */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background z-10" />
          <Image
            src={propertyConfig.heroMedia.src}
            alt={propertyConfig.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
            {propertyConfig.name}
          </h1>
          <p className="text-gold text-sm md:text-base tracking-[0.3em] uppercase">
            {t('common.byInvitationOnly')}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-foreground/0 via-foreground/50 to-foreground/0" />
        </motion.div>
      </section>

      {/* The Residence */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
              {t('property.theResidence')}
            </h2>
            <p className="text-foreground/70 leading-relaxed text-lg max-w-2xl mx-auto">
              {t('propertyContent.residenceDescription')}
            </p>
          </motion.div>

          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: t('property.propertyType'), value: propertyConfig.propertyType },
              { label: t('property.tenure'), value: propertyConfig.tenure },
              { label: t('property.landArea'), value: propertyConfig.landArea },
              { label: t('property.builtUp'), value: propertyConfig.builtUpArea },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-gold text-2xl md:text-3xl font-heading">{item.value}</p>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture & Design */}
      <section className="py-24 px-4 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-8 text-center">
              {t('property.architecture')}
            </h2>
            <p className="text-foreground/70 leading-relaxed text-lg text-center max-w-2xl mx-auto">
              {t('propertyContent.architectureDescription')}
            </p>

            {propertyConfig.architect && (
              <p className="text-gold text-center mt-8">
                {t('property.designedBy')} {propertyConfig.architect}
              </p>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex items-center gap-3 py-3 border-b border-foreground/5">
                  <span className="text-gold">—</span>
                  <span className="text-foreground/70 text-sm">{t(`propertyContent.feature${num}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Provenance */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
              {t('property.provenance')}
            </h2>
            <p className="text-foreground/70 leading-relaxed text-lg max-w-2xl mx-auto">
              {t('propertyContent.provenanceDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24 px-4 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-8">
              {t('property.location')}
            </h2>
            <p className="text-foreground/70 text-lg mb-4">
              {propertyConfig.address}
            </p>
            <p className="text-gold text-sm uppercase tracking-wider">
              {propertyConfig.district}
            </p>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 aspect-video bg-foreground/5 flex items-center justify-center"
          >
            <p className="text-foreground/30 text-sm">{t('property.mapUponRequest')}</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              {t('property.gallery')}
            </h2>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {propertyConfig.gallery.slice(0, 6).map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-[4/3] bg-foreground/5 relative overflow-hidden group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/private/gallery`}
              className="inline-block border border-gold text-gold px-8 py-3 text-sm tracking-wider uppercase hover:bg-gold hover:text-background transition-colors"
            >
              {t('property.viewFullGallery')}
            </Link>
          </div>
        </div>
      </section>

      {/* Documents CTA */}
      <section className="py-24 px-4 bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              {t('property.floorPlans')} & {t('property.documents')}
            </h2>
            <p className="text-foreground/60 mb-8">
              {t('documents.subtitle')}
            </p>
            <Link
              href={`/${locale}/private/documents`}
              className="inline-block bg-gold text-background px-8 py-3 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
            >
              {t('property.accessDocuments')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Private Viewing CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              {t('property.privateViewing')}
            </h2>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              {t('viewing.subtitle')}
            </p>
            <Link
              href={`/${locale}/private/viewing`}
              className="inline-block bg-gold text-background px-8 py-3 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
            >
              {t('property.scheduleViewing')}
            </Link>
            <p className="text-foreground/40 text-xs mt-4 uppercase tracking-wider">
              {t('property.appointmentOnly')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
