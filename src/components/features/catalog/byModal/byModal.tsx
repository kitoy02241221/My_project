import { Button } from "@mui/material";
import { CSSProperties } from "react";

type ByModalProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    name: string;
    description: string;
    price: number;
};

const overlayStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
};

const modalStyle: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    minWidth: "300px",
};

export function ByModal({ isOpen, setIsOpen, name, description, price }: ByModalProps) {
    if (!isOpen) return null;

    return (
        <div>
            <div style={overlayStyle} onClick={() => setIsOpen(false)} />
            <div style={modalStyle}>
                <h1>оформление заказа</h1>
                <h3>{name}</h3>
                <h3>{description}</h3>
                <Button variant="outlined" size="small">
                    {price}₽
                </Button>
                <Button onClick={() => setIsOpen(false)}>отмена</Button>
            </div>
        </div>
    );
}
