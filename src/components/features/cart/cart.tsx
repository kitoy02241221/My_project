import { useEffect, useState } from "react";
import { useGetInCart } from "../../../hooks/useGetInCartProduct";
import { Button } from "@mui/material";
import { AllProductinCartPrice } from "./allProductinCartPrice/allProductinCartPrice";

const productStyle = {
    margin: "10px",
};

const imgStyle = {
    display: "block",
    height: "250px",
    width: "250px",
    borderRadius: "8px",
};

function Cart() {
    const { productinCart, allPrice, error, isLoading, takeProduct } = useGetInCart();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const getIteminCart = async () => {
            await takeProduct();
        };
        getIteminCart();
    }, []);

    return (
        <div>
            <div>
                <h1>{productinCart.length} товаров в корзине</h1>

                {productinCart.map((item) => (
                    <div style={productStyle} key={item.id}>
                        <h3>{item.product?.name}</h3>
                        <img
                            src={item.product.image_url}
                            alt={item.product?.name}
                            style={imgStyle}
                        />
                        <h4>{item.product?.description}</h4>
                        <p>количество: {item.quantity}</p>
                        <p>{item.product.price}₽</p>
                        <Button variant="outlined" size="small">
                            купить
                        </Button>
                    </div>
                ))}
            </div>

            <div>
                <p>
                    <strong>{allPrice}₽</strong> всего
                </p>
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

            <AllProductinCartPrice isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default Cart;
