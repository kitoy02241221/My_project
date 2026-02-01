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
                    body: JSON.stringify({
                        login,
                        password,
                        name,
                        surname,
                    }),
                });

                if (response.data.ok && response.data.success) {
                    api.post("/api/auth/login", {
                        body: JSON.stringify({
                            login,
                            password,
                            name,
                            surname,
                        }),
                    });
                    dispatch(setAuth());
                    return { success: true, data: response.data.user };
                } else {
                    setError(response.data.error || "Ошибка регистрации");
                    return { success: false, error: response.data.error };
                }
            } else {
                const logined = await api.post("/api/auth/login", {
                    body: JSON.stringify({
                        login,
                        password,
                        name,
                        surname,
                    }),
                });

                if (logined.data.success === true) {
                    dispatch(setAuth());
                }
            }
        } catch (err) {
            const errorMessage = "Ошибка сети: " + err;
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
