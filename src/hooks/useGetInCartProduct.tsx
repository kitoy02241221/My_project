import { useState } from "react";
import api from "../api/axiosBase";
import { ItemType } from "../components/features/cart/cartType/itemType";

export const useGetInCart = () => {
    const [productinCart, setProductInCart] = useState<ItemType[]>([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allPrice, setAllPrice] = useState(0);

    const takeProduct = async () => {
        try {
            setError(false);
            setIsLoading(true);
            const response = await api.get("/api/cart");
            setProductInCart(response.data.items);
            setAllPrice(response.data.total);
            setIsLoading(false);
        } catch {
            setError(true);
            setIsLoading(false);
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
