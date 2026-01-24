"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

export type Locale = "ru" | "en";

const translations = { ru, en } as const;

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = typeof ru;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: TranslationValue, path: string): string {
    const keys = path.split(".");
    let value: TranslationValue = obj;

    for (const key of keys) {
        if (typeof value === "object" && value !== null && key in value) {
            value = value[key];
        } else {
            return path;
        }
    }

    return typeof value === "string" ? value : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("ru");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale | null;
        if (savedLocale && (savedLocale === "ru" || savedLocale === "en")) {
            setLocaleState(savedLocale);
        }
        setMounted(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
    };

    // Use default locale for SSR, will update on client
    const currentLocale = mounted ? locale : "ru";

    const t = (key: string, params?: Record<string, string | number>): string => {
        let value = getNestedValue(translations[currentLocale], key);

        if (params) {
            Object.entries(params).forEach(([param, val]) => {
                value = value.replace(`{${param}}`, String(val));
            });
        }

        return value;
    };

    return (
        <I18nContext.Provider value={{ locale: currentLocale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return context;
}
