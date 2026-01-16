import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { FeedbackInput, ChallengeResponse } from "@/types/api";
import { toast } from "sonner";

/**
 * Fetch a nonce challenge token from the backend
 */
async function fetchNonce(): Promise<string> {
    const response = await api.get<ChallengeResponse>("/challenge");
    return response.data.nonce;
}

export const useFeedback = () => {
    return useMutation<void, Error, Omit<FeedbackInput, "nonce">>({
        mutationFn: async (data) => {
            // Fetch nonce before submitting feedback
            const nonce = await fetchNonce();

            // Submit feedback with nonce
            await api.post("/feedback", {
                ...data,
                nonce,
            });
        },
        onSuccess: () => {
            toast.success("Спасибо за ваш отзыв!");
        },
        onError: (error: any) => {
            const errorDetail = error.response?.data?.detail;

            // Handle structured error from backend
            if (Array.isArray(errorDetail)) {
                const message = errorDetail[0]?.msg || "Не удалось отправить отзыв";
                toast.error(message);
            } else if (typeof errorDetail === "object" && errorDetail?.error_code) {
                // Handle error codes from backend (e.g., invalid_challenge)
                const message = errorDetail.message || "Не удалось отправить отзыв";
                toast.error(message);
            } else {
                toast.error(error.message || "Не удалось отправить отзыв");
            }
        },
    });
};
