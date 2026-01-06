"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "../hooks/use-feedback";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface LightweightFeedbackProps {
    prediction_id: string;
}

export function LightweightFeedback({ prediction_id }: LightweightFeedbackProps) {
    const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    const { mutate, isPending } = useFeedback();

    const handleFeedback = (isPositive: boolean) => {
        setFeedbackGiven(isPositive);
        setShowComment(true);

        // Send immediate feedback (rating 5 for yes, 2 for no)
        mutate({
            prediction_id,
            rating: isPositive ? 5 : 2,
            comment: null
        });
    };

    const handleSubmitComment = () => {
        if (!comment.trim()) return;

        mutate({
            prediction_id,
            rating: feedbackGiven ? 5 : 2,
            comment
        });
        setShowComment(false);
    };

    if (feedbackGiven !== null && !showComment) {
        return (
            <p className="text-sm text-muted-foreground text-center">
                Спасибо за отзыв!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {feedbackGiven === null && (
                <div className="text-center space-y-3">
                    <p className="text-sm font-medium">Полезна ли оценка?</p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(true)}
                            disabled={isPending}
                        >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Да
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(false)}
                            disabled={isPending}
                        >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Нет
                        </Button>
                    </div>
                </div>
            )}

            {showComment && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <Textarea
                        placeholder="Хотите добавить комментарий? (необязательно)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none text-sm"
                        rows={2}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComment(false)}
                        >
                            Пропустить
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSubmitComment}
                            disabled={!comment.trim() || isPending}
                        >
                            Отправить
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
