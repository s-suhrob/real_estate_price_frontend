"use client";

import { useI18n } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
    onScrollToForm?: () => void;
}

export function Navbar({ onScrollToForm }: NavbarProps) {
    const { t } = useI18n();

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <a
                        href="#about"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        {t("nav.about")}
                    </a>
                    <a
                        href="#methodology"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        {t("nav.methodology")}
                    </a>
                </div>

                {/* Right side - Language Switcher */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
