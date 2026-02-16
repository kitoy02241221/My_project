import { AxiosError } from "axios";
import { useState } from "react";
import api from "../api/axiosBase";

export const useAddInCart = () => {
    const [isInCart, setIsInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addToCart = async (product_id: number, quantity = 1) => {
        try {
            setLoading(true);
            setError(null);
            await api.post("/api/cart/add", {
                product_id,
                quantity,
            });
            setIsInCart(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = "ошибка добавления товара в корзину, попробуйте позже";
                setError(errorMessage);
            }
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
