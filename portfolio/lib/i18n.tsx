"use client";

import { createContext, use, useState, useEffect, type ReactNode } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";

export type Locale = "en" | "es";

export const translations = { en, es };

type Translations = (typeof translations)[Locale];

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "es") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return use(LocaleContext);
}
