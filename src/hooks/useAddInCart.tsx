import axios from "axios";
import { useState } from "react";
import api from "../api/axiosBase";

export const useAddInCart = () => {
    const [prodInCart, setProductInCart] = useState([]);

    const addProduct = async (productId: number) => {
        try {
            const response = await api.post("/api/cart/add", {
                product_id: productId,
                quantity: 1,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return {
        prodInCart,
        addProduct,
    };
};
