import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { CreateProduct } from "../profileInterface/CreateProduct";
import { close } from "../../../../store/slices/profilePage/openSellModal";
import { useDispatch } from "react-redux";
import { useProduct } from "../../../../hooks/useCreateProduct";
import { UseCropImg } from "../../../../hooks/useCropImg";

function SellModal({ isOpen }: { isOpen: boolean }) {
    const dispatch = useDispatch();

    const [fromData, setFromData] = useState<CreateProduct>({
        image_base64: "",
        name: "",
        description: "",
        price: 0,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [productIsLoad, setProductIsLoad] = useState(false);
    const [productNotLoaded, setProductNotLoaded] = useState(false);

    const { imageBase64, changeInputImg, imgError, setImageBase64 } = UseCropImg();
    const { sellProduct } = useProduct();

    const productData = () => {
        setFromData({ ...fromData, image_base64: imageBase64 });
    };

    const sellModalStyle = {
        display: isOpen ? "block" : "none",
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🚀 Отправка формы");
        console.log("imageBase64 длина:", imageBase64?.length || 0);

        // Проверяем что изображение загружено
        if (!imageBase64 || imageBase64.trim() === "") {
            alert("Сначала загрузите изображение!");
            return;
        }

        // Проверяем остальные поля
        if (!fromData.name.trim()) {
            alert("Введите название товара");
            return;
        }

        if (!fromData.price || fromData.price <= 0) {
            alert("Введите корректную цену");
            return;
        }
        const productData = {
            name: fromData.name.trim(),
            description: fromData.description.trim(),
            price: fromData.price,
            image_base64: imageBase64,
        };

        const response = await sellProduct(productData);

        if (response) {
            setProductIsLoad(true);
            setTimeout(() => {
                setProductIsLoad(false);
                dispatch(close());
                setFromData({
                    image_base64: "",
                    name: "",
                    description: "",
                    price: 0,
                });
                setImageBase64("");
            }, 2000);
        } else {
            setProductNotLoaded(true);
            setTimeout(() => {
                setProductNotLoaded(false);
            }, 3500);
        }
    };

    return (
        <form onSubmit={submit} style={sellModalStyle}>
            <Button
                variant="outlined"
                size="small"
                type="button"
                onClick={() => {
                    dispatch(close());
                }}
            >
                закрыть
            </Button>
            <h1>загрузка товара</h1>
            <TextField
                variant="standard"
                type="file"
                onChange={changeInputImg}
                ref={fileInputRef}
            />

            <TextField
                variant="standard"
                type="text"
                label="название"
                onChange={(e) => {
                    setFromData({ ...fromData, name: e.target.value });
                }}
            />

            <TextField
                variant="standard"
                type="text"
                label="описание"
                onChange={(e) => {
                    setFromData({ ...fromData, description: e.target.value });
                }}
            />

            <TextField
                variant="standard"
                type="number"
                label="цена"
                onChange={(e) => {
                    setFromData({ ...fromData, price: +e.target.value });
                }}
            />

            <Button variant="outlined" size="small" type="submit">
                загрузить
            </Button>

            {imgError && (
                <div>
                    <h2>{imgError}</h2>
                </div>
            )}

            {productIsLoad && (
                <div>
                    <h2>товар успешно загружен!</h2>
                </div>
            )}

            {productNotLoaded && (
                <div>
                    <h2>ошибка при загрузке товара</h2>
                </div>
            )}
        </form>
    );
}

export default SellModal;
