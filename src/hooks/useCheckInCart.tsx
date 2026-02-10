import { useState } from "react";
import api from "../api/axiosBase";

export const useQuantityProduct = () => {
    const [load, setLoad] = useState(false);
    const [cardProductText, setCardProductText] = useState("");

    const getQuantityProduct = async (id: number) => {
        try {
            setLoad(true);
            setCardProductText("");

            const response = await api.get(`/api/cart/check/${id}`);
            console.log(response.data.quantity);
            if (response.data.quantity >= 1) {
                setCardProductText(`в корзине: ${response.data.quantity}`);
            }
            if (response.data.quantity < 1) {
                setCardProductText("в коризну");
            }
        } catch (error) {
            setLoad(false);
        } finally {
            setLoad(false);
        }
    };

    return {
        load,
        cardProductText,
        getQuantityProduct,
    };
};
