import { useState } from "react";
import api from "../api/axiosBase";

export const useSellerStatus = () => {
    const [roleStatus, setRoleStatus] = useState(false);
    const [error, setError] = useState("");
    const [roleChosen, setRoleChosen] = useState(false);

    const checkStatus = async () => {
        try {
            const response = await api.get("/api/user/role-check");
            const { success, roleChosen, role } = await response.data;

            if (success === true && roleChosen === false) {
                setRoleChosen(true);
            } else {
                setRoleChosen(false);
            }

            if (roleChosen === true && role === "seller") {
                setRoleStatus(true);
            } else {
                setRoleStatus(false);
            }
        } catch (error) {
            return error;
        }
    };

    return {
        roleStatus,
        error,
        checkStatus,
        roleChosen,
    };
};
