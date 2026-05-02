'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyConfig } from '@/config/property';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`, { scroll: false });
  };

  const navigation = [
    { href: '/private/briefing', labelKey: 'property.theBrief' },
    { href: '/private/home', labelKey: 'property.theResidence' },
    { href: '/private/gallery', labelKey: 'property.gallery' },
    { href: '/private/documents', labelKey: 'property.documents' },
    { href: '/private/viewing', labelKey: 'property.privateViewing' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Property Name */}
          <Link 
            href={`/${locale}/private/home`}
            className="font-heading text-lg text-foreground hover:text-gold transition-colors"
          >
            {propertyConfig.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`text-sm tracking-wide transition-colors ${
                  pathname.includes(item.href)
                    ? 'text-gold'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => switchLocale('en')}
                className={`transition-colors ${
                  locale === 'en' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                EN
              </button>
              <span className="text-foreground/20">|</span>
              <button
                onClick={() => switchLocale('zh')}
                className={`transition-colors ${
                  locale === 'zh' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                中文
              </button>
              <span className="text-foreground/20">|</span>
              <button
                onClick={() => switchLocale('id')}
                className={`transition-colors ${
                  locale === 'id' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                ID
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-foreground/5 bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm tracking-wide transition-colors ${
                    pathname.includes(item.href)
                      ? 'text-gold'
                      : 'text-foreground/70'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
