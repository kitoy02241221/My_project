import { Button } from "@mui/material";
import { ItemType } from "../cartType/itemType";

const productStyle = {
    margin: "10px",
};

const imgStyle = {
    display: "block",
    height: "250px",
    width: "250px",
    borderRadius: "8px",
};

type PropsType = {
    productinCart: Array<ItemType>;
};

export function CartItem({ productinCart }: PropsType) {
    return (
        <div>
            <h1>{productinCart.length} товаров в корзине</h1>

            {productinCart.map((item: ItemType) => (
                <div style={productStyle} key={item.id}>
                    <h3>{item.product.name}</h3>
                    <img src={item.product.image_url} alt={item.product.name} style={imgStyle} />
                    <h4>{item.product.description}</h4>
                    <p>количество: {item.quantity}</p>
                    <p>{item.product.price}₽</p>
                    <Button variant="outlined" size="small">
                        купить
                    </Button>
                </div>
            ))}
        </div>
    );
}
