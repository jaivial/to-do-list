"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("Common");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-800">{t("pageNotFound")}</h2>
        <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto">{t("pageNotFoundMessage")}</p>
        <div className="mt-10">
          <Link href="/" className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
