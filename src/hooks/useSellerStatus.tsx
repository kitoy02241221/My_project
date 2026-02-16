import { useCallback, useState } from "react";
import api from "../api/axiosBase";

interface RoleCheckResponse {
    success: boolean;
    roleChosen: boolean;
    role: "false" | "seller" | "buyer";
}

interface SellerStatus {
    isSeller: boolean;
    hasChosenRole: boolean;
    isLoading: boolean;
    error: "string" | null;
}

export const useSellerStatus = () => {
    const [roleStatus, setRoleStatus] = useState<SellerStatus>({
        isSeller: false,
        hasChosenRole: false,
        isLoading: false,
        error: null,
    });

    const checkStatus = useCallback(async () => {
        setRoleStatus((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const { data } = await api.get<RoleCheckResponse>("/api/user/role-check");

            setRoleStatus({
                isSeller: data.role === "seller",
                hasChosenRole: data.roleChosen,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setRoleStatus({
                isSeller: false,
                hasChosenRole: false,
                isLoading: false,
                error: null,
            });
        }
    }, []);

    return {
        roleStatus,
        checkStatus,
    };
};
