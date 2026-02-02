import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { hide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";
import { useCallback } from "react";

const buildRoleData = (role: "seller" | "buyer") => ({
    isSeller: role === "seller" ? "seller" : "buyer",
});

const handleApiError = (error: any) => {
    return error.response?.data?.message || "произошла ошибка";
};

function BuyerOrSeller() {
    const dispatch = useDispatch();
    const isHide = useAppSelector((state) => state.buyerOrSeller);

    const sellorBuyStyle = {
        display: isHide ? "block" : "none",
    };

    const chosenRole = useCallback(
        async (role: "buyer" | "seller") => {
            try {
                api.post("/api/user/choose-role", buildRoleData(role));
                dispatch(hide());
            } catch (error) {
                console.error(handleApiError(error));
            }
        },
        [dispatch],
    );

    return (
        <div style={sellorBuyStyle}>
            <h1>вы хотите продавать или покупать?</h1>
            <Button
                variant="outlined"
                size="small"
                onClick={chosenRole.bind(null, "seller")}
            >
                продавать
            </Button>
            <Button
                variant="outlined"
                size="small"
                onClick={chosenRole.bind(null, "buyer")}
            >
                покупать
            </Button>
        </div>
    );
}

export default BuyerOrSeller;
