import { useEffect } from "react";
import { useGetInCart } from "../../../hooks/useGetInCart";
import { Button } from "@mui/material";

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
    const { productinCart, error, isLoading, takeProduct } = useGetInCart();

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
                        <h4>{item.product?.description}</h4>
                        <img
                            src={item.product?.image_url}
                            alt={item.product?.name}
                            style={imgStyle}
                        />
                        <Button variant="outlined" size="small">
                            купить
                        </Button>
                    </div>
                ))}
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
        </div>
    );
}

export default Cart;
