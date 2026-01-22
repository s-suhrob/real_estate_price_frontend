"use client";

import { useState, useEffect } from "react";
import { PredictionResponse } from "@/types/api";
import { DisclaimerShort } from "@/components/disclaimer";
import { LightweightFeedback } from "@/features/feedback/components/LightweightFeedback";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
    const animatedPrice = useCountUp(prediction.price, 1500);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ru-RU", {
            maximumFractionDigits: 0,
        }).format(price);
    };

    const pricePerSqm = area > 0 ? Math.round(prediction.price / area) : 0;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <p className="text-slate-500 mb-2">Оценочная стоимость</p>
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                        {formatPrice(animatedPrice)}
                        <span className="text-2xl md:text-3xl font-semibold text-slate-400 ml-2">TJS</span>
                    </h2>
                    <p className="text-slate-500 mt-3">
                        {formatPrice(pricePerSqm)} TJS за м²
                    </p>
                </div>

                {/* Price Range Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {/* Min Card */}
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">от</p>
                        <p className="text-lg md:text-xl font-bold text-slate-700">
                            {formatPrice(prediction.range_low)}
                        </p>
                        <p className="text-xs text-slate-400">TJS</p>
                    </div>

                    {/* Main Price Card */}
                    <div className="bg-slate-900 rounded-xl p-4 text-center transform scale-105 shadow-lg">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">оценка</p>
                        <p className="text-lg md:text-xl font-bold text-white">
                            {formatPrice(prediction.price)}
                        </p>
                        <p className="text-xs text-slate-400">TJS</p>
                    </div>

                    {/* Max Card */}
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">до</p>
                        <p className="text-lg md:text-xl font-bold text-slate-700">
                            {formatPrice(prediction.range_high)}
                        </p>
                        <p className="text-xs text-slate-400">TJS</p>
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
                    Новый расчёт
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
