import { useState } from "react";
import api from "../api/axiosBase";

export const useGetInCart = () => {
    const [productinCart, setProductInCart] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const takeProduct = async () => {
        try {
            setError(false);
            setIsLoading(true);

            const response = await api.get("/api/cart");

            if (response.status === 200) {
                setProductInCart(response.data.items);
            }
        } catch (error) {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        productinCart,
        error,
        isLoading,
        takeProduct,
    };
};
