import { useEffect, useState } from "react";
import { useAddInCart } from "../../../../hooks/useAddInCart";

import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useProducts } from "../../../../hooks/useProducts";

const catalogStyle = {
    display: "flex",
};

const productStyle = {
    margin: "10px",
};

const imgStyle = {
    display: "block",
    height: "250px",
    width: "250px",
    borderRadius: "8px",
};

type TypeProduct = {
    name: string;
    description: string;
    price: number;
    id: number;
    image_url: string;
    user_id: number;
};

function Product() {
    const [data, setData] = useState<Array<TypeProduct>>([]);
    const [loading, setLoading] = useState(false);

    const isAuth = useAppSelector((state) => state.auth);

    const { addToCart } = useAddInCart();
    const { buttonText, cartText, setCartText, checkInCart } = useProducts();

    useEffect(() => {
        listProduct();
    }, [isAuth]);

    const addItem = async (id: number) => {
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
        } catch (error) {
            console.log("ошибка при добавлении в корзину");
        }
    };

    const listProduct = async () => {
        setLoading(true);
        const response = await api.get("/api/products");
        if (response.data.success === true) {
            const products = response.data.products;
            setData(products);

            products.forEach((product: TypeProduct) => {
                checkInCart(product.id);
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    return (
        <div style={catalogStyle}>
            {loading && <div>загрузка...x</div>}
            {data.map((item: any, index) => (
                <div style={productStyle} key={`${item.id}-${index}`} id={item.id}>
                    <img src={item.image_url} alt={item.name} style={imgStyle} />

                    <h3>{item.name}</h3>
                    <h4>{item.description}</h4>

                    <Button
                        id={item.id}
                        variant="contained"
                        size="small"
                        disabled={!isAuth}
                        onClick={() => {
                            addItem(item.id);
                        }}
                    >
                        {buttonText(item.id, isAuth, cartText)}
                    </Button>
                    <Button variant="contained" size="small">
                        купить
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default Product;
