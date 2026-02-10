import { useEffect } from "react";
import { useGetInCart } from "../../../../hooks/useGetInCartProduct";

export function AllProductinCartPrice({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
            <button onClick={() => setIsOpen(false)}>Закрыть</button>
            <p>общая сумма заказа составит {allPrice}₽ </p>
        </div>
    );
}
