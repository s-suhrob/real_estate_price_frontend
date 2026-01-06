import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { FeedbackInput } from "@/types/api";
import { toast } from "sonner";

export const useFeedback = () => {
    return useMutation<void, Error, FeedbackInput>({
        mutationFn: async (data) => {
            await api.post("/feedback", data);
        },
        onSuccess: () => {
            toast.success("Спасибо за ваш отзыв!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail?.[0]?.msg || error.message || "Не удалось отправить отзыв";
            toast.error(message);
        },
    });
};
