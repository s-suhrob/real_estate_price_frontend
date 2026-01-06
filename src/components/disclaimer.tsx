"use client";

import { Info } from "lucide-react";

interface DisclaimerProps {
    variant?: "short" | "expanded";
}

const SHORT_TEXT =
    "Оценка носит аналитический характер и основана на статистической модели. Фактическая цена сделки может отличаться.";

const EXPANDED_TEXT =
    "Сервис предоставляет ориентировочную оценку рыночной стоимости на основе данных объявлений и модели машинного обучения. Результат не является отчетом об оценке, не является офертой и не заменяет профессиональную оценку. На итоговую цену влияют состояние объекта, юридические факторы, срочность продажи и условия сделки.";

export function Disclaimer({ variant = "short" }: DisclaimerProps) {
    const text = variant === "short" ? SHORT_TEXT : EXPANDED_TEXT;

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
