import { useState } from "react";
import api from "../api/axiosBase";

export const useGetInCart = () => {
    const [productinCart, setProductInCart] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allPrice, setAllPrice] = useState(0);

    const takeProduct = async () => {
        try {
            setIsLoading(true);

            const response = await api.get("/api/cart");
            setAllPrice(response.data.total);
            setProductInCart(response.data.items);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
            setError(false);
        }
    };

    return {
        productinCart,
        allPrice,
        error,
        isLoading,
        takeProduct,
    };
};
