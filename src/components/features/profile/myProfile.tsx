import SellModal from "./sellModal/sellModal";
import { useSellerStatus } from "../../../hooks/useSellerStatus";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

function MyProfile() {
    const { roleStatus, checkStatus } = useSellerStatus();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        checkStatus();
    }, []);

    if (roleStatus.isSeller === false)
        return (
            <div>
                <h1>имя</h1>
                <h2>фамилия</h2>
            </div>
        );

    return (
        <div>
            <h1>имя</h1>
            <h2>фамилия</h2>

            {roleStatus && (
                <>
                    <Button variant="outlined" size="small" onClick={() => setIsOpen(true)}>
                        продать товар
                    </Button>
                    <SellModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </>
            )}
        </div>
    );
}

export default MyProfile;
