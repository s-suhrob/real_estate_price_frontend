"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionResponse } from "@/types/api";
import { DisclaimerShort } from "@/components/disclaimer";
import { ResultActions } from "./ResultActions";
import { LightweightFeedback } from "@/features/feedback/components/LightweightFeedback";
import { Separator } from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Calculator } from "lucide-react";
import { useState } from "react";

interface PriceResultProps {
    prediction: PredictionResponse;
    area: number;
    onReset: () => void;
}

export function PriceResult({ prediction, area, onReset }: PriceResultProps) {
    const [techInfoOpen, setTechInfoOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ru-RU", {
            maximumFractionDigits: 0,
        }).format(price);
    };

    const pricePerSqm = area > 0 ? Math.round(prediction.price / area) : 0;
    const rangePercentage = Math.max(0, Math.min(100,
        ((prediction.price - prediction.range_low) / (prediction.range_high - prediction.range_low)) * 100
    ));

    return (
        <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-2xl overflow-hidden mt-8">
            <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="text-xl text-center">Результат оценки</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
                {/* Main Price */}
                <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        Оценочная рыночная стоимость
                    </p>
                    <h2 className="text-5xl font-extrabold text-primary animate-in fade-in zoom-in duration-500">
                        {formatPrice(prediction.price)} <span className="text-2xl">TJS</span>
                    </h2>
                </div>

                {/* Price per m² */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calculator className="w-4 h-4" />
                    <span className="text-sm">
                        Цена за м²: <strong className="text-foreground">{formatPrice(pricePerSqm)} TJS</strong>
                    </span>
                </div>

                <Separator />

                {/* Confidence Range */}
                <div className="space-y-3 px-4">
                    <div className="flex justify-between text-sm font-medium">
                        <span>{formatPrice(prediction.range_low)} TJS</span>
                        <span>{formatPrice(prediction.range_high)} TJS</span>
                    </div>
                    <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
                        />
                        <div
                            className="absolute top-0 bottom-0 w-3 h-3 bg-primary rounded-full shadow-lg transition-all duration-1000 ease-out"
                            style={{ left: `calc(${rangePercentage}% - 6px)` }}
                        />
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        Ожидаемый диапазон рыночной цены
                    </p>
                </div>

                <DisclaimerShort />

                {/* Action buttons */}
                <ResultActions prediction={prediction} area={area} onReset={onReset} />

                <Separator />

                {/* Lightweight Feedback */}
                {prediction.prediction_id && (
                    <LightweightFeedback prediction_id={prediction.prediction_id} />
                )}

                {/* Technical Info (Collapsible) */}
                {prediction.prediction_id && (
                    <Collapsible open={techInfoOpen} onOpenChange={setTechInfoOpen}>
                        <CollapsibleTrigger className="flex items-center justify-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors w-full py-2">
                            <span>Техническая информация</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${techInfoOpen ? "rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-center text-xs text-muted-foreground/50 pt-1 animate-in slide-in-from-top-2">
                            <p>ID: {prediction.prediction_id}</p>
                            {prediction.currency && <p>Валюта: {prediction.currency}</p>}
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </CardContent>
        </Card>
    );
}
