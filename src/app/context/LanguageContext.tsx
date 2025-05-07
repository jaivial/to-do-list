"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enMessages from "../../i18n/messages/en.json";
import esMessages from "../../i18n/messages/es.json";

// Tipos
type Language = "en" | "es";
type Messages = typeof enMessages;

interface LanguageContextType {
  language: Language;
  messages: Messages;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Proveedor del contexto
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para almacenar el idioma actual
  const [language, setLanguage] = useState<Language>("en");

  // Estado para almacenar los mensajes según el idioma
  const [messages, setMessages] = useState<Messages>(enMessages);

  // Efecto para cargar el idioma guardado en localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguage(savedLanguage);
        setMessages(savedLanguage === "en" ? enMessages : esMessages);
      }
    } catch (error) {
      console.error("Error al cargar el idioma:", error);
    }
  }, []);

  // Función para cambiar el idioma
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setMessages(lang === "en" ? enMessages : esMessages);
    try {
      localStorage.setItem("language", lang);
    } catch (error) {
      console.error("Error al guardar el idioma:", error);
    }
  };

  // Función para obtener traducciones
  const translate = (key: string): string => {
    try {
      const keys = key.split(".");

      // Navegar por el objeto de mensajes
      let current = messages;
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          // Último nivel
          return (current as any)[k] || key;
        } else {
          // Nivel intermedio
          current = (current as any)[k];
          if (!current) return key;
        }
      }

      return key; // En caso de que algo falle
    } catch (error) {
      console.error(`Error traduciendo clave ${key}:`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        messages,
        setLanguage: changeLanguage,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage debe ser usado dentro de un LanguageProvider");
  }
  return context;
};
