"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "../hooks/use-feedback";
import { Star } from "lucide-react";

interface FeedbackFormProps {
    prediction_id: string;
    onCompleted: () => void;
}

export function FeedbackForm({ prediction_id, onCompleted }: FeedbackFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");

    const { mutate, isPending } = useFeedback();

    const handleSubmit = () => {
        if (rating === 0) return;

        mutate({
            prediction_id,
            rating,
            comment: comment || null,
        }, {
            onSuccess: () => {
                onCompleted();
            }
        });
    };

    return (
        <div className="space-y-6 max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h3 className="text-lg font-semibold">Насколько точным был прогноз?</h3>
                <p className="text-sm text-muted-foreground mt-1">Ваш отзыв помогает улучшить нашу модель</p>
            </div>

            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform active:scale-90"
                    >
                        <Star
                            className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                ? "fill-primary text-primary"
                                : "text-muted border-none"
                                } transition-colors`}
                        />
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="Есть замечания? (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
            />

            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onCompleted}>
                    Отмена
                </Button>
                <Button
                    className="flex-1"
                    disabled={rating === 0 || isPending}
                    onClick={handleSubmit}
                >
                    {isPending ? "Отправка..." : "Отправить"}
                </Button>
            </div>
        </div>
    );
}
