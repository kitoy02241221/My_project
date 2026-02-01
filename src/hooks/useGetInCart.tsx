import axios from "axios";
import { useState } from "react";

export const useGetInCart = () => {
    axios.defaults.withCredentials = true;

    const [productinCart, setProductInCart] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const takeProduct = async () => {
        try {
            setError(false);
            setIsLoading(true);

            const response = await axios.get("/api/cart");

            if (response.status === 200) {
                setProductInCart(response.data.items);
                console.log(productinCart);
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
