import { useState } from "react";
import { useAppSelector } from "./useAppSelector";
import { setAuth } from "../store/slices/homePage/auth.slice";
import { useDispatch } from "react-redux";
import api from "../api/axiosBase";
import { Registartion } from "../components/features/navbar/authModal/authInterface/registerInteface";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    const authType = useAppSelector((state) => state.authType);

    const register = async (registerData: Registartion) => {
        setLoading(true);
        setError(null);

        try {
            if (authType === true) {
                const response = await api.post("/api/auth/register", registerData);
                await api.post("/api/auth/login", registerData);
                dispatch(setAuth());
                return { success: true, data: response.data.user };
            } else {
                await api.post("/api/auth/login", registerData);
                dispatch(setAuth());
            }
        } catch (err: any) {
            const errorMessage = err.response?.data.message || err.message || "произошла ошибка";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        error,
        loading,
        register,
    };
};
