"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFeedback } from "../hooks/use-feedback";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useI18n } from "@/i18n";

interface LightweightFeedbackProps {
    prediction_id: string;
}

export function LightweightFeedback({ prediction_id }: LightweightFeedbackProps) {
    const { t } = useI18n();
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
                {t("feedback.thanks")}
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {feedbackGiven === null && (
                <div className="text-center space-y-3">
                    <p className="text-sm font-medium">{t("feedback.helpful")}</p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(true)}
                            disabled={isPending}
                        >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {t("feedback.yes")}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(false)}
                            disabled={isPending}
                        >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            {t("feedback.no")}
                        </Button>
                    </div>
                </div>
            )}

            {showComment && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <Textarea
                        placeholder={t("feedback.commentPlaceholder")}
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
                            {t("feedback.skip")}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSubmitComment}
                            disabled={!comment.trim() || isPending}
                        >
                            {t("feedback.submit")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
