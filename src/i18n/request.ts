import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Si no hay locale, usar 'en' como predeterminado
  const safeLocale = locale || 'en';
  
  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
    timeZone: 'UTC'
  };
}); 