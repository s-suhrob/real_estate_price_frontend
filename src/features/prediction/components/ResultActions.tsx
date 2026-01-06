"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Save, RotateCcw, Check } from "lucide-react";
import { PredictionResponse } from "@/types/api";
import { toast } from "sonner";

interface ResultActionsProps {
    prediction: PredictionResponse;
    area: number;
    onReset: () => void;
}

export function ResultActions({ prediction, area, onReset }: ResultActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleSave = () => {
        try {
            const saved = JSON.parse(localStorage.getItem("saved_predictions") || "[]");
            const newEntry = {
                ...prediction,
                area,
                savedAt: new Date().toISOString(),
            };
            saved.push(newEntry);
            localStorage.setItem("saved_predictions", JSON.stringify(saved));
            toast.success("Оценка сохранена!");
        } catch {
            toast.error("Не удалось сохранить оценку");
        }
    };

    const handleShare = async () => {
        const shareText = `Оценка недвижимости в Душанбе: ${prediction.price.toLocaleString("ru-RU")} TJS (${prediction.range_low.toLocaleString("ru-RU")} – ${prediction.range_high.toLocaleString("ru-RU")} TJS)`;

        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            toast.success("Скопировано в буфер обмена");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Не удалось скопировать");
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Поделиться
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Новый расчёт
            </Button>
        </div>
    );
}
