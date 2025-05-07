"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import ReactFlagsSelect from "react-flags-select";

export default function LanguageSwitcherWithFlags() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mapeo de idiomas a códigos de país para las banderas
  const languageToCountry: Record<string, string> = {
    en: "US", // Inglés -> Estados Unidos
    es: "ES", // Español -> España
  };

  // Mapeo de códigos de país a idiomas
  const countryToLanguage: Record<string, "en" | "es"> = {
    US: "en",
    ES: "es",
  };

  const handleSelect = (countryCode: string) => {
    const selectedLanguage = countryToLanguage[countryCode];
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-600">{t("LanguageSwitcher.switchLanguage")}:</span>
      <ReactFlagsSelect
        selected={languageToCountry[language]}
        onSelect={handleSelect}
        countries={["US", "ES"]}
        customLabels={{ US: t("LanguageSwitcher.english"), ES: t("LanguageSwitcher.spanish") }}
        placeholder={t("LanguageSwitcher.selectLanguage")}
        className="language-flags-select"
        selectButtonClassName="language-select-button"
        selectedSize={14}
        optionsSize={14}
        fullWidth={false}
      />
      <style jsx global>{`
        .language-flags-select {
          min-width: 120px;
          font-size: 0.875rem;
        }
        .language-flags-select .flag-select__btn {
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
          background-color: white;
        }
        .language-flags-select .flag-select__btn:hover {
          border-color: #cbd5e0;
        }
        .language-flags-select .flag-select__btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
          border-color: #4299e1;
        }
        .language-flags-select .flag-select__options {
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          margin-top: 0.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .language-flags-select .flag-select__option {
          padding: 0.5rem;
          cursor: pointer;
        }
        .language-flags-select .flag-select__option:hover {
          background-color: #f7fafc;
        }
      `}</style>
    </div>
  );
}
