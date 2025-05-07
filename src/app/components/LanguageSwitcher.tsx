"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { locales } from "../../i18n/routing";
import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Solo ejecutar en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mapeo de idiomas a códigos de país para las banderas
  const languageToCountry: Record<string, string> = {
    en: "US", // Inglés -> Estados Unidos
    es: "ES", // Español -> España
  };

  // Mapeo de códigos de país a idiomas
  const countryToLanguage: Record<string, string> = {
    US: "en",
    ES: "es",
  };

  const handleSelect = (countryCode: string) => {
    const newLocale = countryToLanguage[countryCode];

    try {
      // Para páginas de dashboard, mantener la misma estructura de ruta
      if (pathname.includes("dashboard")) {
        router.replace("/dashboard", { locale: newLocale });
      }
      // Para páginas de autenticación, mantener la estructura correspondiente
      else if (pathname.includes("auth/login")) {
        router.replace("/auth/login", { locale: newLocale });
      } else if (pathname.includes("auth/register")) {
        router.replace("/auth/register", { locale: newLocale });
      }
      // Para otras páginas, usar replace que mantiene la estructura de la URL
      else {
        router.replace(pathname, { locale: newLocale });
      }
    } catch (error) {
      console.error("Error al cambiar de idioma:", error);
      // Si hay error, ir a la página principal con el nuevo idioma
      router.replace("/", { locale: newLocale });
    }
  };

  // No renderizar nada durante SSR para evitar errores de hidratación
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-600">{t("switchLanguage")}:</span>
      <ReactFlagsSelect selected={languageToCountry[locale]} onSelect={handleSelect} countries={locales.map((loc) => languageToCountry[loc])} customLabels={{ US: t("english"), ES: t("spanish") }} placeholder={t("selectLanguage")} className="language-flags-select" selectButtonClassName="language-select-button" selectedSize={14} optionsSize={14} fullWidth={false} />
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
