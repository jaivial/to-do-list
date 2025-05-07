"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/auth/login`);
      }
    }
  }, [user, loading, router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
