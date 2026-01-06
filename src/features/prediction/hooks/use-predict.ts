import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ApartmentInput, PredictionResponse } from "@/types/api";
import { toast } from "sonner";

export const usePredictPrice = () => {
    return useMutation<PredictionResponse, Error, ApartmentInput>({
        mutationFn: async (data) => {
            const response = await api.post<PredictionResponse>("/predict", data);
            return response.data;
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail?.[0]?.msg || error.message || "Не удалось рассчитать стоимость";
            toast.error(message);
        },
    });
};
