"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { locales } from "../../i18n/routing";
import { useEffect, useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

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
      <label htmlFor="language-select" className="mr-2 text-sm text-gray-600">
        {t("switchLanguage")}:
      </label>
      <select id="language-select" value={locale} onChange={handleChange} className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc === "en" ? "english" : "spanish")}
          </option>
        ))}
      </select>
    </div>
  );
}
