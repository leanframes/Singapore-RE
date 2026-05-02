'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { propertyConfig } from '@/config/property';

// CountUp animation hook
function useCountUp(end: number, duration: number = 2000, start: number = 0, decimals: number = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = start + (end - start) * easeOutQuart;
      setCount(Number(value.toFixed(decimals)));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration, start, decimals]);

  return { count, ref };
}

// Recent GCB transactions data
const recentTransactions = [
  { address: 'Cluny Road', date: 'Jan 2026', psf: 2850, landSqft: 18500, price: 52.7 },
  { address: 'Nassim Road', date: 'Dec 2025', psf: 3120, landSqft: 15200, price: 47.4 },
  { address: 'Dalvey Road', date: 'Nov 2025', psf: 2680, landSqft: 21000, price: 56.3 },
];

// Scatter plot data for PSF vs Land Size
const scatterData = [
  { landSize: 15000, psf: 2850 },
  { landSize: 15200, psf: 3120 },
  { landSize: 18500, psf: 2680 },
  { landSize: 21000, psf: 2450 },
  { landSize: 16500, psf: 2920 },
  { landSize: 19000, psf: 2580 },
  { landSize: 17500, psf: 2780 },
  { landSize: 15000, psf: 3050 }, // This property highlighted
];

interface ProvenanceBriefingProps {
  onComplete: () => void;
}

export default function ProvenanceBriefing({ onComplete }: ProvenanceBriefingProps) {
  const t = useTranslations('briefing.local');
  const tCommon = useTranslations('briefing.common');
  const locale = useLocale();
  
  // Current SGT time
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const sgtTime = new Date().toLocaleString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      setCurrentTime(sgtTime);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // CountUp hooks
  const landArea = useCountUp(15000, 2000);
  const plotRatio = useCountUp(0.35, 2000, 0, 2);
  const estimatedYield = useCountUp(2.1, 2000, 0, 1);

  const handleProceed = async () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Custom cursor for briefing */}
      <style jsx global>{`
        body {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%23B9975B' fill-opacity='0.6'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23B9975B'/%3E%3C/svg%3E") 12 12, auto;
        }
      `}</style>

      {/* Hero Header */}
      <section className="relative py-16 px-4 border-b border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">
                {t('classification')}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
                {t('title')}
              </h1>
              <p className="text-foreground/60 mt-2">{propertyConfig.name}</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-gold text-lg">{currentTime}</div>
              <p className="text-foreground/40 text-xs uppercase tracking-wider">Singapore Time (SGT)</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Module 1: Title & Land */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('titleLand.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('titleLand.subtitle')}</p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <p className="text-gold text-2xl md:text-3xl font-heading">Freehold</p>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('titleLand.tenure')}
                </p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <span ref={landArea.ref} className="text-gold text-2xl md:text-3xl font-heading">
                  {landArea.count.toLocaleString()}
                </span>
                <span className="text-gold text-lg"> sqft</span>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('titleLand.landArea')}
                </p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <span ref={plotRatio.ref} className="text-gold text-2xl md:text-3xl font-heading">
                  {plotRatio.count}
                </span>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('titleLand.plotRatio')}
                </p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <p className="text-gold text-2xl md:text-3xl font-heading">GCB</p>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('titleLand.zoning')}
                </p>
              </div>
            </div>

            {/* Title Details */}
            <div className="bg-foreground/[0.02] border border-foreground/10 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-foreground font-medium mb-3">{t('titleLand.lotDetails')}</h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li className="flex justify-between py-2 border-b border-foreground/5">
                      <span>{t('titleLand.lotNumber')}</span>
                      <span className="text-foreground">MK27-01234A</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-foreground/5">
                      <span>{t('titleLand.district')}</span>
                      <span className="text-foreground">District 10</span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-foreground/5">
                      <span>{t('titleLand.gpr')}</span>
                      <span className="text-foreground">0.35</span>
                    </li>
                    <li className="flex justify-between py-2">
                      <span>{t('titleLand.buildCoverage')}</span>
                      <span className="text-foreground">35%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-3">{t('titleLand.encumbrances')}</h3>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('titleLand.cleanTitle')}</span>
                  </div>
                  <p className="text-foreground/50 text-sm mt-4">
                    {t('titleLand.titleNote')}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-foreground/30 text-xs mt-4">
              {t('titleLand.source')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module 2: Architectural Pedigree */}
      <section className="py-16 px-4 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('architecture.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('architecture.subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-6">
                  <div>
                    <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">
                      {t('architecture.architect')}
                    </p>
                    <p className="text-foreground text-xl font-heading">
                      {propertyConfig.architect || 'SCDA Architects'}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">
                      {t('architecture.yearBuilt')}
                    </p>
                    <p className="text-foreground text-xl font-heading">
                      {propertyConfig.yearBuilt || 2018}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">
                      {t('architecture.style')}
                    </p>
                    <p className="text-foreground text-xl font-heading">
                      Modern Tropical Minimalism
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-foreground font-medium mb-3">{t('architecture.awards')}</h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-gold">★</span>
                      SIA Design Award 2019
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">★</span>
                      BCA Green Mark GoldPlus
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-background border border-foreground/10 p-6">
                <h3 className="text-foreground font-medium mb-4">{t('architecture.scdaProfile')}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  {t('architecture.scdaDescription')}
                </p>
                <ul className="space-y-2 text-foreground/50 text-sm">
                  <li>• Alila Villas Uluwatu, Bali</li>
                  <li>• Soori High Line, New York</li>
                  <li>• The Lalu, Sun Moon Lake</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Module 3: Transaction Intelligence */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('transactions.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('transactions.subtitle')}</p>

            {/* Recent Transactions Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-4 pr-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      {t('transactions.address')}
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      {t('transactions.date')}
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs text-right">
                      {t('transactions.psf')}
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs text-right">
                      {t('transactions.landSize')}
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs text-right">
                      {t('transactions.price')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, index) => (
                    <tr key={index} className="border-b border-foreground/5">
                      <td className="py-4 pr-4 text-foreground">{tx.address}</td>
                      <td className="py-4 px-4 text-center text-foreground/70">{tx.date}</td>
                      <td className="py-4 px-4 text-right text-gold">${tx.psf.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right text-foreground/70">{tx.landSqft.toLocaleString()} sqft</td>
                      <td className="py-4 px-4 text-right text-foreground">S${tx.price}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scatter Plot */}
            <div className="bg-foreground/[0.02] border border-foreground/10 p-6">
              <h3 className="text-foreground font-medium mb-4">{t('transactions.psfVsLand')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis 
                      dataKey="landSize" 
                      name="Land Size"
                      unit=" sqft"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#FAFAF9', opacity: 0.5, fontSize: 12 }}
                      domain={[14000, 22000]}
                    />
                    <YAxis 
                      dataKey="psf" 
                      name="PSF"
                      unit=""
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#FAFAF9', opacity: 0.5, fontSize: 12 }}
                      domain={[2200, 3300]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(250, 250, 249, 0.1)',
                        borderRadius: 0,
                      }}
                      labelStyle={{ color: '#B9975B' }}
                      itemStyle={{ color: '#FAFAF9' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'Land Size') return [`${value.toLocaleString()} sqft`, name];
                        return [`$${value.toLocaleString()}`, 'PSF'];
                      }}
                    />
                    <Scatter 
                      data={scatterData.slice(0, -1)} 
                      fill="#FAFAF940"
                    />
                    <Scatter 
                      data={[scatterData[scatterData.length - 1]]} 
                      fill="#B9975B"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-foreground/50 text-xs text-center mt-4">
                {t('transactions.chartNote')}
              </p>
            </div>

            <p className="text-foreground/30 text-xs mt-4">
              {t('transactions.source')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module 4: URA Master Plan 2025 Impact */}
      <section className="py-16 px-4 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('masterPlan.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('masterPlan.subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Placeholder */}
              <div className="bg-background border border-foreground/10 aspect-video flex items-center justify-center">
                <p className="text-foreground/30 text-sm">{tCommon('mapPlaceholder')}</p>
              </div>

              {/* Impact Assessment */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-background border border-foreground/10 p-4">
                  <span className="text-green-400 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{t('masterPlan.noZoningChanges')}</p>
                    <p className="text-foreground/50 text-sm">{t('masterPlan.zoningNote')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-background border border-foreground/10 p-4">
                  <span className="text-green-400 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{t('masterPlan.transportUpgrade')}</p>
                    <p className="text-foreground/50 text-sm">{t('masterPlan.transportNote')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-background border border-foreground/10 p-4">
                  <span className="text-green-400 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{t('masterPlan.heritageStatus')}</p>
                    <p className="text-foreground/50 text-sm">{t('masterPlan.heritageNote')}</p>
                  </div>
                </div>

                <div className="bg-gold/10 border border-gold/20 p-4 mt-6">
                  <p className="text-gold text-sm font-medium">{t('masterPlan.outlook')}</p>
                  <p className="text-foreground/70 text-sm mt-1">{t('masterPlan.outlookNote')}</p>
                </div>
              </div>
            </div>

            <p className="text-foreground/30 text-xs mt-6">
              {t('masterPlan.source')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module 5: Yield Scenario */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('yield.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('yield.subtitle')}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-2">
                  {t('yield.estimatedRent')}
                </p>
                <p className="text-gold text-3xl font-heading">S$85,000</p>
                <p className="text-foreground/50 text-sm mt-1">{t('yield.perMonth')}</p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-2">
                  {t('yield.grossYield')}
                </p>
                <span ref={estimatedYield.ref} className="text-gold text-3xl font-heading">
                  {estimatedYield.count}%
                </span>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-2">
                  {t('yield.tenantProfile')}
                </p>
                <p className="text-gold text-xl font-heading">{t('yield.tenantTypes')}</p>
              </div>
            </div>

            <div className="bg-foreground/[0.02] border border-foreground/10 p-6 mt-6">
              <h3 className="text-foreground font-medium mb-3">{t('yield.scenarioAnalysis')}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {t('yield.scenarioDescription')}
              </p>
            </div>

            <p className="text-foreground/30 text-xs mt-4">
              {t('yield.source')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <button
              onClick={handleProceed}
              className="bg-gold hover:bg-gold-light text-background px-12 py-4 text-sm tracking-wider uppercase transition-colors"
            >
              {t('cta.button')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
