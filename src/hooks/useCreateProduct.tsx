import { useState } from "react";
import api from "../api/axiosBase";
import { CreateProduct } from "../components/features/profile/profileInterface/CreateProduct";

export const useProduct = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const sellProduct = async (formData: CreateProduct) => {
        try {
            setLoading(true);

            await api.post("api/products/create", formData);
            return true;
        } catch (error: any) {
            setLoading(false);
            setError("ошибка сети");
            console.log(error);
            return false;
        } finally {
            setLoading(false);
            setError("");
        }
    };

    return {
        error,
        loading,
        sellProduct,
    };
};
