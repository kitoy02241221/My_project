import { useState } from "react";
import api from "../api/axiosBase";

export const useProduct = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getProduct = async (
        img: string,
        name: string,
        description: string,
        price: number,
    ) => {
        try {
            setLoading(true);

            const response = await api.post("api/products/create", {
                body: JSON.stringify({
                    image_base64: img,
                    name,
                    description,
                    price,
                }),
            });
            if (response.data.success === true) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            setLoading(false);
            setError("ошибка сети");
            console.log(error);
        } finally {
            setLoading(false);
            setError("");
        }
    };

    return {
        error,
        loading,
        getProduct,
    };
};
