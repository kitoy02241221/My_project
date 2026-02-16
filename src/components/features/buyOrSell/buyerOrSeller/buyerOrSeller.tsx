import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { hide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";
import { useSellerStatus } from "../../../../hooks/useSellerStatus";
import { useEffect, useState } from "react";

const buildRoleData = (role: "seller" | "buyer") => ({
    isSeller: role === "seller" ? "seller" : "buyer",
});

function BuyerOrSeller() {
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();
    const isAuth = useAppSelector((state) => state.auth);
    const { roleStatus, checkStatus } = useSellerStatus();

    useEffect(() => {
        checkStatus();
    }, [isAuth]);

    if (roleStatus.isLoading) return null;
    if (!isAuth) return null;
    if (roleStatus.hasChosenRole === true) return null;

    const chosenRole = async (role: "buyer" | "seller") => {
        try {
            await api.post("/api/user/choose-role", buildRoleData(role));
            await checkStatus();
            dispatch(hide());
        } catch (error) {
            setErrorMessage("произошла ошибка");
        }
    };

    return (
        <div>
            {errorMessage && <h1>{errorMessage}</h1>}
            <h1>вы хотите продавать или покупать?</h1>
            <Button
                variant="outlined"
                size="small"
                onClick={() => {
                    chosenRole("seller");
                }}
            >
                продавать
            </Button>
            <Button
                variant="outlined"
                size="small"
                onClick={() => {
                    chosenRole("buyer");
                }}
            >
                покупать
            </Button>
        </div>
    );
}

export default BuyerOrSeller;
