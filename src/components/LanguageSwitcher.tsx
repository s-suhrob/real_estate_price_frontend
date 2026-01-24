"use client";

import { useI18n, Locale } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((l) => l.code === locale) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code: Locale) => {
        setLocale(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium hover:bg-slate-100"
            >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${locale === lang.code ? "bg-slate-50 font-medium" : ""
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
