import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { hide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";

function BuyerOrSeller() {
    const dispatch = useDispatch();

    const isHide = useAppSelector((state) => state.buyerOrSeller);

    const sellorBuyStyle = {
        display: isHide ? "block" : "none",
    };

    const buyer = async () => {
        await api.post("api/user/choose-role", {
            body: JSON.stringify({ isSeller: "buyer" }),
        });
        dispatch(hide());
    };

    const seller = async () => {
        await api.post("/api/user/choose-role", {
            body: JSON.stringify({ isSeller: "seller" }),
        });
        dispatch(hide());
    };

    return (
        <div style={sellorBuyStyle}>
            <h1>вы хотите продавать или покупать?</h1>
            <Button variant="outlined" size="small" onClick={seller}>
                продавать
            </Button>
            <Button variant="outlined" size="small" onClick={buyer}>
                покупать
            </Button>
        </div>
    );
}

export default BuyerOrSeller;
