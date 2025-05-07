"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "../../../../i18n/navigation";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations("Login");

  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  useEffect(() => {
    if (user) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t("fillFields"));
      return;
    }

    try {
      setError("");
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("failedSignIn"));
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-end mb-4 px-4">
          <LanguageSwitcher />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{t("title")}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("or")}{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            {t("createAccount")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75">
                {loading ? t("signingIn") : t("signIn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
