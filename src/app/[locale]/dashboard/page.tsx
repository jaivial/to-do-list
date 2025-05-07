"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { TodoProvider } from "../../context/TodoContext";
import TodoList from "../../components/TodoList";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslations, useMessages, NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations("Dashboard");
  const messages = useMessages();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    setIsClient(true);
    if (!loading && !user) {
      router.push(`/${locale}/auth/login`);
    }
  }, [user, loading, router, locale]);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <LanguageSwitcher />
        </div>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TodoProvider>
            <TodoList />
          </TodoProvider>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
