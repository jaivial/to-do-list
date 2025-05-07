import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "../../i18n/routing";
import { NextAuthProvider } from "../providers/NextAuthProvider";
import { AuthProvider } from "../context/AuthContext";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.includes(locale as (typeof locales)[number]);
  if (!isValidLocale) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../i18n/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NextAuthProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextAuthProvider>
    </NextIntlClientProvider>
  );
}
