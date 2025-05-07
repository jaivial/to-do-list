"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "../lib/types";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }

    if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirigimos directamente a dashboard sin usar locale
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Primero ejecutamos el signOut
      await signOut({ redirect: false });

      // Redirigimos directamente a la página de login sin usar locale
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
