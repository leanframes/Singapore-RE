import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'zh', 'id'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale) ? requested : defaultLocale;
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Singapore',
    now: new Date(),
  };
});
