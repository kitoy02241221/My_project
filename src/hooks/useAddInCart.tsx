import api from "../api/axiosBase";
import { useState } from "react";

export const useAddInCart = () => {
    const [isInCart, setIsInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addToCart = async (product_id: number, quantity = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post("/api/cart/add", {
                product_id,
                quantity,
            });

            if (response.data.success) {
                setIsInCart(true);

                return { success: true, data: response.data };
            } else {
                setError(response.data.error || "Неизвестная ошибка");
                return { success: false, error: response.data.error };
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Ошибка сети";
            setError(errorMessage);
            console.error("Ошибка добавления в корзину:", error);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        isInCart,
        loading,
        error,
        addToCart,
        resetCartState: () => {
            setIsInCart(false);
            setError(null);
        },
    };
};
