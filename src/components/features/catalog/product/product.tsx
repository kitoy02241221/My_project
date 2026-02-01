import { useEffect, useState } from "react";
import { useAddInCart } from "../../../../hooks/useAddInCart";

function Product() {
    const [data, setData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);

    const { prodInCart, addProduct } = useAddInCart();

    const listProduct = async () => {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products", {
            method: "GET",
        });
        const data = await response.json();
        if (data.success === true) {
            setData(data.products);
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
                    <button
                        onClick={() => {
                            addProduct(item.id);
                        }}
                    >
                        в корзину
                    </button>
                    <button>купить</button>
                </div>
            ))}
        </div>
    );
}

export default Product;
