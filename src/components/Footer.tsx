'use client';

import { useTranslations } from 'next-intl';
import { consultantConfig, propertyConfig } from '@/config/property';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-foreground/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          {/* Consultant Info */}
          <p className="text-sm text-foreground/60">
            {t('privateRepresentation', {
              consultant: consultantConfig.name,
              agency: consultantConfig.agency,
            })}
          </p>
          
          <p className="text-xs text-foreground/40">
            {t('ceaNo', { ceaNo: consultantConfig.ceaNo })}
          </p>

          {/* Confidential Notice */}
          <div className="pt-4 border-t border-foreground/5">
            <p className="text-xs text-foreground/30">
              {t('confidentialNotice')}
            </p>
            <p className="text-xs text-foreground/20 mt-2">
              {t('pdpaNotice')}
            </p>
          </div>

          {/* Property Reference */}
          <p className="text-xs text-foreground/10 pt-4">
            Ref: {propertyConfig.ref}
          </p>
        </div>
      </div>
    </footer>
  );
}
