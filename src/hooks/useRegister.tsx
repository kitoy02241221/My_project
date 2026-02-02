import { useState } from "react";
import { useAppSelector } from "./useAppSelector";
import { setAuth } from "../store/slices/homePage/auth.slice";
import { useDispatch } from "react-redux";
import api from "../api/axiosBase";
import axios from "axios";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const authType = useAppSelector((state) => state.authType);

    const dispatch = useDispatch();

    const register = async (
        login: string,
        password: string,
        name: string,
        surname: string,
    ) => {
        setLoading(true);
        setError(null);

        try {
            if (authType === true) {
                const response = await api.post("/api/auth/register", {
                    login,
                    password,
                    name,
                    surname,
                });

                if (response.data.ok && response.data.success) {
                    api.post("/api/auth/login", {
                        login,
                        password,
                        name,
                        surname,
                    });
                    dispatch(setAuth());
                    return { success: true, data: response.data.user };
                } else {
                    setError(response.data.error || "Ошибка регистрации");
                    return { success: false, error: response.data.error };
                }
            } else {
                const logined = await api.post("/api/auth/login", {
                    login,
                    password,
                });

                if (logined.data.success === true) {
                    dispatch(setAuth());
                }
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data.message || err.message || "произошла ошибка";

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
