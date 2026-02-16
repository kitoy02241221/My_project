import { useState } from "react";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAdditionCart } from "../../../../hooks/useAdditionCart";
import { ByModal } from "../byModal/byModal";

const productStyle = {
    margin: "10px",
    display: "inline-block",
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

type SearchProductProps = {
    productData: TypeProduct[];
    searchLoading: boolean;
};

export function SearchProduct({ productData, searchLoading }: SearchProductProps) {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const isAuth = useAppSelector((state) => state.auth);
    const { additionLoad, addItem } = useAdditionCart();

    if (searchLoading) {
        return <div>поиск...</div>;
    }

    if (!productData || productData.length === 0) {
        return <div>Ничего не найдено</div>;
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {productData.map((item: TypeProduct) => {
                return (
                    <div style={productStyle} key={item.id}>
                        <img src={item.image_url} alt={item.name} style={imgStyle} />
                        <h3>{item.price}₽</h3>
                        <h3>{item.name}</h3>
                        <h4>{item.description}</h4>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => addItem(item.id)}
                            disabled={!isAuth}
                        >
                            {additionLoad ? "добавление..." : "Добавить"}
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => setSelectedProductId(item.id)}
                            disabled={!isAuth}
                        >
                            Купить
                        </Button>

                        <ByModal
                            isOpen={selectedProductId === item.id}
                            setIsOpen={() => setSelectedProductId(null)}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                        />
                    </div>
                );
            })}
        </div>
    );
}
