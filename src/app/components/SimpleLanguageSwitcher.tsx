"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function SimpleLanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <label htmlFor="language-select" className="mr-2 text-sm text-gray-600">
        {t("LanguageSwitcher.switchLanguage")}:
      </label>
      <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value as "en" | "es")} className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="en">{t("LanguageSwitcher.english")}</option>
        <option value="es">{t("LanguageSwitcher.spanish")}</option>
      </select>
    </div>
  );
}
