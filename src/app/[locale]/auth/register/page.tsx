"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "../../../../i18n/navigation";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();
  const router = useRouter();
  const t = useTranslations("Register");

  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  // Use useEffect to handle redirection when user is already logged in
  useEffect(() => {
    if (user) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, router, locale]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError(t("passwordsDoNotMatch"));
      return false;
    }
    if (password.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setError("");
      setLoading(true);
      await register(name, email, password);
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("failedRegistration"));
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show loading state instead of redirecting directly
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
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            {t("signIn")}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <div className="mt-1">
                <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

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
                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                {t("confirmPassword")}
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75">
                {loading ? t("registering") : t("register")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
