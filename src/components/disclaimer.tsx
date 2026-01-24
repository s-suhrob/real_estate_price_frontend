"use client";

import { Info } from "lucide-react";
import { useI18n } from "@/i18n";

interface DisclaimerProps {
    variant?: "short" | "expanded";
}

export function Disclaimer({ variant = "short" }: DisclaimerProps) {
    const { t } = useI18n();
    const text = variant === "short"
        ? t("methodology.short")
        : t("methodology.expanded");

    return (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="leading-relaxed">{text}</p>
        </div>
    );
}

export function DisclaimerShort() {
    return <Disclaimer variant="short" />;
}

export function DisclaimerExpanded() {
    return <Disclaimer variant="expanded" />;
}
