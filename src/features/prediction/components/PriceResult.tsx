"use client";

import { useState, useEffect } from "react";
import { PredictionResponse } from "@/types/api";
import { DisclaimerShort } from "@/components/disclaimer";
import { LightweightFeedback } from "@/features/feedback/components/LightweightFeedback";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n";

interface PriceResultProps {
    prediction: PredictionResponse;
    area: number;
    onReset: () => void;
}

// Counter animation hook
function useCountUp(target: number, duration: number = 1500): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = 0;

        const updateCount = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (target - startValue) * easeOut);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [target, duration]);

    return count;
}

export function PriceResult({ prediction, area, onReset }: PriceResultProps) {
    const { t, locale } = useI18n();
    const animatedPrice = useCountUp(prediction.price, 1500);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
            maximumFractionDigits: 0,
        }).format(price);
    };

    const pricePerSqm = area > 0 ? Math.round(prediction.price / area) : 0;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <p className="text-slate-500 mb-2">{t("result.estimatedPrice")}</p>
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                        {formatPrice(animatedPrice)}
                        <span className="text-2xl md:text-3xl font-semibold text-slate-400 ml-2">TJS</span>
                    </h2>
                    <p className="text-slate-500 mt-3">
                        {t("result.pricePerSqm", { price: formatPrice(pricePerSqm) })}
                    </p>
                </div>

                {/* Price Range Slider - Unified for all screen sizes */}
                <div className="mb-8">
                    {/* Range slider visualization */}
                    <div className="relative px-2">
                        {/* Range labels */}
                        <div className="flex justify-between text-sm md:text-base text-slate-500 mb-2">
                            <span>{formatPrice(prediction.range_low)} TJS</span>
                            <span>{formatPrice(prediction.range_high)} TJS</span>
                        </div>

                        {/* Slider track */}
                        <div className="relative h-2 md:h-3 bg-slate-200 rounded-full">
                            {/* Filled portion */}
                            <div
                                className="absolute h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"
                                style={{ width: '100%' }}
                            />
                            {/* Marker for estimate */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full border-2 border-white shadow-md"
                                style={{
                                    left: `${((prediction.price - prediction.range_low) / (prediction.range_high - prediction.range_low)) * 100}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </div>

                        {/* Range text */}
                        <p className="text-center text-xs md:text-sm text-slate-400 mt-2">
                            {t("result.from")} — {t("result.to")}
                        </p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mb-6">
                    <DisclaimerShort />
                </div>

                {/* New Calculation Button */}
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="w-full h-12 text-base font-medium"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t("result.newEstimate")}
                </Button>

                {/* Feedback */}
                {prediction.prediction_id && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <LightweightFeedback prediction_id={prediction.prediction_id} />
                    </div>
                )}
            </div>
        </div>
    );
}
