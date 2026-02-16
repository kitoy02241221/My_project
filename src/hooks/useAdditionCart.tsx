import { useState } from "react";
import { useAddInCart } from "./useAddInCart";
import { useProducts } from "./useProducts";

export const useAdditionCart = () => {
    const [error, setError] = useState("");
    const [additionLoad, setAdditionLoad] = useState(false);

    const { addToCart } = useAddInCart();
    const { cartText, setCartText } = useProducts();

    const addItem = async (id: number) => {
        setAdditionLoad(true);
        setError("");
        try {
            await addToCart(id);
            const currentQuantity = cartText[id].quantity;
            const newQuantity = currentQuantity + 1;

            setCartText((prev) => ({
                ...prev,
                [id]: {
                    quantity: newQuantity,
                    in_cart: true,
                },
            }));
            setAdditionLoad(false);
        } catch (error) {
            setAdditionLoad(false);
            setError("ошибка при добавлении товара в корзину");
            setTimeout(() => {
                setError("");
            }, 3500);
        }
    };

    return {
        error,
        setError,
        additionLoad,
        addItem,
    };
};
