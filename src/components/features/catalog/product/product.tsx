import { useEffect, useState } from "react";
import { useAddInCart } from "../../../../hooks/useAddInCart";
import api from "../../../../api/axiosBase";
import { Button } from "@mui/material";

function Product() {
    const [data, setData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);

    const { prodInCart, addProduct } = useAddInCart();

    const listProduct = async () => {
        setLoading(true);

        const response = await api.get("/api/products");
        if (response.data.success === true) {
            setData(response.data.products);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        listProduct();
    }, []);

    return (
        <div style={catalogStyle}>
            {loading && <div>загрузка...x</div>}
            {data.map((item: any, index) => (
                <div
                    style={productStyle}
                    key={`${item.id}-${index}`}
                    id={item.id}
                >
                    <img
                        src={item.image_url}
                        alt={item.name}
                        style={imgStyle}
                    />
                    <h3>{item.name}</h3>
                    <h4>{item.description}</h4>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={addProduct.bind(null, item.id)}
                    >
                        в корзину
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
