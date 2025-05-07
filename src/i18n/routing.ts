import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es'] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/auth/login': '/auth/login',
    '/auth/register': '/auth/register',
    '/not-found': '/not-found'
  }
}); 