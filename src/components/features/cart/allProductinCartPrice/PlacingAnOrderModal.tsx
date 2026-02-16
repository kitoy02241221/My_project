import { useEffect } from "react";
import { useGetInCart } from "../../../../hooks/useGetInCartProduct";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function PlacingAnOrderModal({ isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    const { allPrice, takeProduct } = useGetInCart();

    useEffect(() => {
        takeProduct();
    }, [allPrice]);

    const modalStyle = {
        display: isOpen ? "block" : "none",
    };

    return (
        <div style={modalStyle}>
            <h2>Оформление заказа</h2>
            <button onClick={onClose}>Закрыть</button>
            <p>общая сумма заказа составит {allPrice}₽ </p>
        </div>
    );
}
