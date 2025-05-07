"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcherWithFlags from "../LanguageSwitcherWithFlags";
import { usePathname } from "next/navigation";

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Determinar el título basado en la ruta actual si no se proporciona uno
  const getDefaultTitle = () => {
    if (pathname?.includes("dashboard")) {
      return t("Dashboard.title");
    }
    if (pathname?.includes("auth/login")) {
      return t("Login.title");
    }
    if (pathname?.includes("auth/register")) {
      return t("Register.title");
    }
    return "Todo App";
  };

  const displayTitle = title || getDefaultTitle();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">{displayTitle}</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <button onClick={handleLogout} className="px-3 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t("Dashboard.logout")}
              </button>
            )}
            <LanguageSwitcherWithFlags />
          </div>
        </div>
      </div>
    </nav>
  );
}
