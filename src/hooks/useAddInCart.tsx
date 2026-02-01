import axios from "axios";
import { useState } from "react";

const api = axios.create({
    baseURL: "http://localhost:5000", // уже включает весь URL
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const useAddInCart = () => {
    const [prodInCart, setProductInCart] = useState([]);

    const addProduct = async (productId: number) => {
        try {
            const response = await api.post("/api/cart/add", {
                product_id: productId,
                quantity: 1,
            });
            if (response.data.success === true) {
                console.log("удалось добавить товар в корзину");
            } else {
                console.log("ошибка при добавлении в корзину");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        prodInCart,
        addProduct,
    };
};
