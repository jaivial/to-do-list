"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { TodoProvider } from "../context/TodoContext";
import TodoList from "../components/TodoList";
import Navbar from "../components/ui/Navbar";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!loading && !user) {
      router.push(`/auth/login`);
    }
  }, [user, loading, router]);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={t("Dashboard.title")} />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <TodoProvider>
            <TodoList />
          </TodoProvider>
        </div>
      </div>
    </div>
  );
}
