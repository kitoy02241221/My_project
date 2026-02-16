import { useCallback, useState } from "react";
import api from "../api/axiosBase";
import { CreateProduct } from "../components/features/profile/profileInterface/CreateProduct";

export const useProduct = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const sellProduct = useCallback(async (formData: CreateProduct) => {
        try {
            setLoading(true);
            setError("");
            await api.post("api/products/create", formData);
            return true;
        } catch (error: any) {
            setLoading(false);
            setError("ошибка сети");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        error,
        loading,
        sellProduct,
    };
};
