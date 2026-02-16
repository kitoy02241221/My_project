import { useCallback, useState } from "react";
import api from "../api/axiosBase";

type CartType = {
    quantity: number;
    in_cart: boolean;
};

export const useProducts = () => {
    const [cartText, setCartText] = useState<Record<string, CartType>>({});

    const buttonText = (id: number, isAuth: boolean, cartText: Record<string, CartType>) => {
        const cartItem = cartText[id];

        if (!isAuth) {
            return "в корзину";
        }
        if (!cartItem) {
            return "в корзину";
        }
        if (cartItem.in_cart && cartItem.quantity > 0) {
            return `в корзине ${cartItem.quantity}`;
        }

        return "в корзину";
    };

    const checkInCart = useCallback(async (id: number) => {
        try {
            const response = await api.get(`/api/cart/check/${id}`);
            setCartText((prev) => ({
                ...prev,
                [id]: {
                    quantity: response.data.quantity || 0,
                    in_cart: response.data.in_cart || false,
                },
            }));
        } catch (error) {
            setCartText((prev) => ({
                ...prev,
                [id]: {
                    quantity: 0,
                    in_cart: false,
                },
            }));
        }
    }, []);

    return {
        buttonText,
        cartText,
        checkInCart,
        setCartText,
    };
};
