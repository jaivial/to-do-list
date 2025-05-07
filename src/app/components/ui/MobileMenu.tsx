"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcherWithFlags from "../LanguageSwitcherWithFlags";
import { User } from "../../lib/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => Promise<void>;
}

export default function MobileMenu({ isOpen, onClose, user, onLogout }: MobileMenuProps) {
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Gestionar la apertura y cierre con animaciones
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    } else {
      // Si estamos cerrando, primero animamos la salida
      if (isVisible) {
        setIsAnimatingOut(true);
        // Esperamos a que termine la animación antes de ocultar
        const timer = setTimeout(() => {
          setIsVisible(false);
          setIsAnimatingOut(false);
        }, 300); // Duración igual a la transición CSS
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, isVisible]);

  // Prevenir scroll del cuerpo cuando el menú está abierto
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Manejar el cierre del menú con animación
  const handleClose = () => {
    setIsAnimatingOut(true);
    const timer = setTimeout(() => {
      onClose();
    }, 250); // Ligeramente menor que la duración de la animación
    return () => clearTimeout(timer);
  };

  // Si no está abierto ni animando, no renderizamos nada
  if (!isVisible && !isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 flex justify-end">
        {/* Overlay con animación de fade */}
        <div
          className="fixed inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out"
          style={{
            opacity: isAnimatingOut ? 0 : 0.75,
          }}
          onClick={handleClose}
          aria-hidden="true"
        ></div>

        {/* Menu panel con animación de deslizamiento desde la derecha */}
        <div
          ref={menuRef}
          className="relative flex flex-col max-w-xs w-full bg-white shadow-xl"
          style={{
            transform: isAnimatingOut ? "translateX(100%)" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
            animation: isOpen && !isAnimatingOut ? "slideIn 0.3s ease-in-out forwards" : isAnimatingOut ? "slideOut 0.3s ease-in-out forwards" : "none",
          }}
        >
          <div className="px-4 py-5 space-y-6 sm:p-6 h-full">
            {/* Close button */}
            <div className="flex items-center justify-end">
              <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500" onClick={handleClose}>
                <span className="sr-only">{t("Navbar.closeMenu")}</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex flex-col space-y-5 mt-6">
              <div className="px-2">
                <LanguageSwitcherWithFlags />
              </div>

              {user && (
                <div className="px-2 mt-4">
                  <button
                    onClick={() => {
                      setIsAnimatingOut(true);
                      setTimeout(() => {
                        onLogout();
                      }, 250);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t("Dashboard.logout")}
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
