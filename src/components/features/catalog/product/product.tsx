import { useEffect, useState } from "react";
import { ByModal } from "../byModal/byModal";

import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useProducts } from "../../../../hooks/useProducts";
import { useAdditionCart } from "../../../../hooks/useAdditionCart";

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

type ResponseProductType = {
    success: boolean;
    products: TypeProduct[];
};

function Product() {
    const [data, setData] = useState<Array<TypeProduct>>([]);
    const [loading, setLoading] = useState(false);
    const [productError, setProductError] = useState("");
    const [selectdProductId, setSelectedProductid] = useState(0);

    const isAuth = useAppSelector((state) => state.auth);

    const { buttonText, cartText, checkInCart } = useProducts();
    const { error, additionLoad, addItem, setError } = useAdditionCart();

    const listProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get<ResponseProductType>("/api/products");
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
        } catch (error) {
            setLoading(false);
            setProductError("ошибка при загрузке товаров");
            setTimeout(() => {
                setError("");
            }, 3500);
        }
    };

    useEffect(() => {
        listProduct();
    }, [isAuth]);

    return (
        <div>
            <div style={catalogStyle}>
                {loading && <p>загрузка...x</p>}
                {productError && <p>{productError}</p>}
                {data.map((item: any, index) => (
                    <div style={productStyle} key={`${item.id}-${index}`} id={item.id}>
                        <img src={item.image_url} alt={item.name} style={imgStyle} />
                        <h3>{item.price}₽</h3>
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
                            {additionLoad && <p>{additionLoad}</p>}
                            {error && <p>{error}</p>}
                            {buttonText(item.id, isAuth, cartText)}
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!isAuth}
                            onClick={() => setSelectedProductid(item.id)}
                        >
                            купить
                        </Button>
                        <ByModal
                            isOpen={selectdProductId === item.id}
                            setIsOpen={() => setSelectedProductid(0)}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Product;
