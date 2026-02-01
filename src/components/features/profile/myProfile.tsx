import SellModal from "./sellModal/sellModal";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { open } from "../../../store/slices/profilePage/openSellModal";
import { useSellerStatus } from "../../../hooks/useSellerStatus";
import { useEffect } from "react";

function MyProfile() {
    const isOpen: boolean = useAppSelector((state) => state.openSellModal);
    const { roleStatus, checkStatus } = useSellerStatus();
    checkStatus();

    const dispatch = useDispatch();

    const sellProd = () => {
        dispatch(open());
    };

    return (
        <div>
            <h1>имя</h1>
            <h2>фамилия</h2>

            {roleStatus && (
                <>
                    <button onClick={sellProd}>продать товар</button>
                    <SellModal isOpen={isOpen} />
                </>
            )}
        </div>
    );
}

export default MyProfile;
