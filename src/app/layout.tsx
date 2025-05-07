import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextAuthProvider } from "./providers/NextAuthProvider";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import LanguageSwitcher from "./components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application with authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Usar el locale predeterminado para el layout principal
  const locale = "en";
  const messages = (await import(`../i18n/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex justify-end p-4">
            <LanguageSwitcher />
          </div>
          <NextAuthProvider>
            <AuthProvider>{children}</AuthProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
