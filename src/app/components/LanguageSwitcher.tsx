"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { locales } from "../../i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

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
