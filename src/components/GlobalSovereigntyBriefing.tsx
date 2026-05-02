'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { propertyConfig } from '@/config/property';

// CountUp animation hook
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
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
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration, start]);

  return { count, ref };
}

// Price index data 2014-2026
const priceIndexData = [
  { year: '2014', value: 100 },
  { year: '2015', value: 97 },
  { year: '2016', value: 94 },
  { year: '2017', value: 93 },
  { year: '2018', value: 101 },
  { year: '2019', value: 104 },
  { year: '2020', value: 102 },
  { year: '2021', value: 115 },
  { year: '2022', value: 128 },
  { year: '2023', value: 135 },
  { year: '2024', value: 146 },
  { year: '2025', value: 153 },
  { year: '2026', value: 158 },
];

// Comparison data for tax scorecard
const comparisonData = [
  { metric: 'capitalGainsTax', sg: '0%', dubai: '0%', switzerland: '0%*', uk: '28%' },
  { metric: 'estateDuty', sg: '0%', dubai: '0%', switzerland: '0-50%', uk: '40%' },
  { metric: 'dividendTax', sg: '0%', dubai: '0%', switzerland: '35%', uk: '39.35%' },
  { metric: 'politicalStability', sg: '1st', dubai: '23rd', switzerland: '3rd', uk: '27th' },
  { metric: 'crsReporting', sg: 'Limited', dubai: 'Yes', switzerland: 'Yes', uk: 'Yes' },
  { metric: 'chinaExtradition', sg: 'No', dubai: 'No', switzerland: 'No', uk: 'Yes' },
];

// Family office pathway steps
const foPathwaySteps = [
  { step: 1, key: 'assetAcquisition' },
  { step: 2, key: 'establishSFO' },
  { step: 3, key: 'employmentPass' },
  { step: 4, key: 'taxFreeGains' },
];

interface GlobalSovereigntyBriefingProps {
  onComplete: () => void;
}

export default function GlobalSovereigntyBriefing({ onComplete }: GlobalSovereigntyBriefingProps) {
  const t = useTranslations('briefing.global');
  const tCommon = useTranslations('briefing.common');
  const locale = useLocale();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('health');
  const [showFOModal, setShowFOModal] = useState(false);
  const [foFormData, setFOFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foSubmitted, setFOSubmitted] = useState(false);

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

  // CountUp hooks for stats
  const capitalGains = useCountUp(0, 1500);
  const estateDuty = useCountUp(0, 1500);
  const growthRate = useCountUp(7.9, 2000, 0);

  const handleFOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/family-office-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foFormData),
      });
      setFOSubmitted(true);
    } catch (error) {
      console.error('Failed to submit FO lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceed = async () => {
    onComplete();
  };

  const lifestyleTabs = [
    { id: 'health', label: t('familyOS.tabs.health') },
    { id: 'education', label: t('familyOS.tabs.education') },
    { id: 'security', label: t('familyOS.tabs.security') },
    { id: 'lifestyle', label: t('familyOS.tabs.lifestyle') },
    { id: 'pets', label: t('familyOS.tabs.pets') },
  ];

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

      {/* Module 1: Capital Protection Scorecard */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('scorecard.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('scorecard.subtitle')}</p>

            {/* Key Stats with CountUp */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <span ref={capitalGains.ref} className="text-4xl md:text-5xl font-heading text-gold">
                  {capitalGains.count}%
                </span>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('scorecard.capitalGains')}
                </p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <span ref={estateDuty.ref} className="text-4xl md:text-5xl font-heading text-gold">
                  {estateDuty.count}%
                </span>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('scorecard.estateDuty')}
                </p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                <span ref={growthRate.ref} className="text-4xl md:text-5xl font-heading text-gold">
                  +{growthRate.count.toFixed(1)}%
                </span>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mt-2">
                  {t('scorecard.growth2024')}
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-4 pr-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      {t('scorecard.metric')}
                    </th>
                    <th className="py-4 px-4 text-gold font-normal uppercase tracking-wider text-xs">
                      Singapore
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      Dubai
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      Switzerland
                    </th>
                    <th className="py-4 px-4 text-foreground/50 font-normal uppercase tracking-wider text-xs">
                      UK
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.metric} className="border-b border-foreground/5">
                      <td className="py-4 pr-4 text-foreground/70">
                        {t(`scorecard.metrics.${row.metric}`)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-green-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {row.sg}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-foreground/50">{row.dubai}</td>
                      <td className="py-4 px-4 text-center text-foreground/50">{row.switzerland}</td>
                      <td className="py-4 px-4 text-center text-foreground/50">{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-foreground/30 text-xs mt-4">
              {t('scorecard.sources')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module 2: Family Office Pathway */}
      <section className="py-16 px-4 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('familyOffice.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('familyOffice.subtitle')}</p>

            {/* Pathway Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {foPathwaySteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-background border border-foreground/10 p-6 h-full">
                    <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-medium mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-foreground font-medium mb-2">
                      {t(`familyOffice.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-foreground/50 text-sm">
                      {t(`familyOffice.steps.${step.key}.description`)}
                    </p>
                  </div>
                  {index < foPathwaySteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gold z-10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setShowFOModal(true)}
              className="bg-gold hover:bg-gold-light text-background px-8 py-4 text-sm tracking-wider uppercase transition-colors"
            >
              {t('familyOffice.ctaButton')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Module 3: Family Operating System */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('familyOS.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('familyOS.subtitle')}</p>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-foreground/10 pb-4">
              {lifestyleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
                    activeTab === tab.id
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'health' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-foreground font-heading text-xl mb-4">
                      {t('familyOS.health.title')}
                    </h3>
                    <ul className="space-y-3 text-foreground/70 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Mount Elizabeth Novena</strong> – 8 min drive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Gleneagles Hospital</strong> – 12 min drive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Raffles Hospital</strong> – 15 min drive</span>
                      </li>
                    </ul>
                    <p className="text-gold text-sm mt-6 italic">
                      {t('familyOS.health.conciergeNote')}
                    </p>
                  </div>
                  <div className="bg-foreground/[0.02] border border-foreground/10 aspect-video flex items-center justify-center">
                    <p className="text-foreground/30 text-sm">{tCommon('mapPlaceholder')}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-foreground font-heading text-xl mb-4">
                    {t('familyOS.education.title')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {['UWCSEA', 'Tanglin Trust', 'SAS'].map((school) => (
                      <div key={school} className="bg-foreground/[0.02] border border-foreground/10 p-6 text-center">
                        <p className="text-foreground font-heading text-lg">{school}</p>
                        <p className="text-foreground/50 text-xs mt-2">{t('familyOS.education.annualFees')}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {t('familyOS.education.description')}
                  </p>
                  <p className="text-gold text-sm mt-4 italic">
                    {t('familyOS.education.strategyNote')}
                  </p>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-foreground font-heading text-xl mb-4">
                    {t('familyOS.security.title')}
                  </h3>
                  <ul className="space-y-4 text-foreground/70 text-sm">
                    <li className="flex items-start gap-3 bg-foreground/[0.02] border border-foreground/10 p-4">
                      <span className="text-green-400 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <span>{t('familyOS.security.gurkha')}</span>
                    </li>
                    <li className="flex items-start gap-3 bg-foreground/[0.02] border border-foreground/10 p-4">
                      <span className="text-green-400 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <span>{t('familyOS.security.enclave')}</span>
                    </li>
                    <li className="flex items-start gap-3 bg-foreground/[0.02] border border-foreground/10 p-4">
                      <span className="text-green-400 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <span>{t('familyOS.security.privacy')}</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'lifestyle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div>
                    <h3 className="text-foreground font-heading text-xl mb-4">
                      {t('familyOS.lifestyle.title')}
                    </h3>
                    <ul className="space-y-3 text-foreground/70 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-gold">★★★</span>
                        <span>{t('familyOS.lifestyle.michelin')}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Tanglin Club</strong> – 5 min drive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Singapore Island Country Club</strong> – 8 min drive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gold mt-1">•</span>
                        <span><strong>Sentosa Golf Club</strong> – 20 min drive</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-foreground/[0.02] border border-foreground/10 aspect-video flex items-center justify-center">
                    <p className="text-foreground/30 text-sm">{tCommon('mapPlaceholder')}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pets' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-foreground font-heading text-xl mb-4">
                    {t('familyOS.pets.title')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-foreground/[0.02] border border-foreground/10 p-6">
                      <h4 className="text-foreground font-medium mb-2">Beecroft Animal Hospital</h4>
                      <p className="text-foreground/50 text-sm mb-3">{t('familyOS.pets.beecroft')}</p>
                      <span className="inline-block bg-gold/20 text-gold text-xs px-2 py-1 uppercase tracking-wider">
                        {t('familyOS.pets.cashless')}
                      </span>
                    </div>
                    <div className="bg-foreground/[0.02] border border-foreground/10 p-6">
                      <h4 className="text-foreground font-medium mb-2">{t('familyOS.pets.relocation')}</h4>
                      <p className="text-foreground/50 text-sm">
                        {t('familyOS.pets.relocationDescription')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Module 4: Wealth Preservation ROI */}
      <section className="py-16 px-4 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              {t('roi.title')}
            </h2>
            <p className="text-foreground/50 text-sm mb-8">{t('roi.subtitle')}</p>

            {/* Chart */}
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceIndexData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B9975B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B9975B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#FAFAF9', opacity: 0.5, fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#FAFAF9', opacity: 0.5, fontSize: 12 }}
                    domain={[80, 180]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0A',
                      border: '1px solid rgba(250, 250, 249, 0.1)',
                      borderRadius: 0,
                    }}
                    labelStyle={{ color: '#B9975B' }}
                    itemStyle={{ color: '#FAFAF9' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#B9975B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-foreground/70 text-sm text-center max-w-2xl mx-auto">
              {t('roi.caption')}
            </p>
            <p className="text-foreground/30 text-xs text-center mt-4">
              {t('roi.source')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
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

      {/* Family Office Modal */}
      {showFOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-foreground/10 p-8 w-full max-w-md"
          >
            {!foSubmitted ? (
              <>
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  {t('familyOffice.modal.title')}
                </h3>
                <p className="text-foreground/50 text-sm mb-6">
                  {t('familyOffice.modal.subtitle')}
                </p>
                <form onSubmit={handleFOSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={tCommon('namePlaceholder')}
                    value={foFormData.name}
                    onChange={(e) => setFOFormData({ ...foFormData, name: e.target.value })}
                    required
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder={tCommon('emailPlaceholder')}
                    value={foFormData.email}
                    onChange={(e) => setFOFormData({ ...foFormData, email: e.target.value })}
                    required
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder={tCommon('phonePlaceholder')}
                    value={foFormData.phone}
                    onChange={(e) => setFOFormData({ ...foFormData, phone: e.target.value })}
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
                  />
                  <textarea
                    placeholder={tCommon('messagePlaceholder')}
                    value={foFormData.message}
                    onChange={(e) => setFOFormData({ ...foFormData, message: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none resize-none"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowFOModal(false)}
                      className="flex-1 border border-foreground/20 py-3 text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors text-sm uppercase tracking-wider"
                    >
                      {tCommon('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gold hover:bg-gold-light text-background py-3 text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? '...' : tCommon('submit')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  {t('familyOffice.modal.successTitle')}
                </h3>
                <p className="text-foreground/50 text-sm mb-6">
                  {t('familyOffice.modal.successMessage')}
                </p>
                <button
                  onClick={() => setShowFOModal(false)}
                  className="bg-gold hover:bg-gold-light text-background px-8 py-3 text-sm uppercase tracking-wider transition-colors"
                >
                  {tCommon('close')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
