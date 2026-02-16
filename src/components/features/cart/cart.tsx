import { useEffect, useState } from "react";
import { useGetInCart } from "../../../hooks/useGetInCartProduct";
import { Button } from "@mui/material";
import { PlacingAnOrderModal } from "./allProductinCartPrice/PlacingAnOrderModal";

import { CartItem } from "./cartItem/cartItem";

function Cart() {
    const [isOpen, setIsOpen] = useState(false);

    const { allPrice, productinCart, error, isLoading, takeProduct } = useGetInCart();

    useEffect(() => {
        const getIteminCart = () => {
            takeProduct();
        };
        getIteminCart();
    }, []);

    return (
        <div>
            <div>
                {error && <p>ошибка загрузки товаров</p>}
                <p>
                    <strong>{allPrice}₽</strong> всего
                </p>
                <CartItem productinCart={productinCart} />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    оформить все
                </Button>
            </div>

            {error && (
                <div>
                    <h2>произошла ошибка получения ваших товаров</h2>
                </div>
            )}
            {isLoading && (
                <div>
                    <h2>загрузка товаров...</h2>
                </div>
            )}

            <PlacingAnOrderModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
            />
        </div>
    );
}

export default Cart;
