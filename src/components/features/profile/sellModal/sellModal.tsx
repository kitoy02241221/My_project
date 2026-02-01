import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { close } from "../../../../store/slices/profilePage/openSellModal";
import { useProduct } from "../../../../hooks/useProduct";
import { UseCropImg } from "../../../../hooks/useCropImg";

function SellModal({ isOpen }: { isOpen: boolean }) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [productIsLoad, setProductIsLoad] = useState(false);
    const [productNotLoaded, setProductNotLoaded] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const changePrice = (e: string) => {
        setPrice(Number(e) || 0);
    };

    const { getProduct } = useProduct();
    const { imageBase64, changeInputImg, imgError } = UseCropImg();

    const sellModalStyle = {
        display: isOpen ? "block" : "none",
    };

    const submit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const result = await getProduct(
                imageBase64,
                name,
                description,
                price,
            );
            if (result === true) {
                setProductIsLoad(true);
                setTimeout(() => {
                    setProductIsLoad(false);
                }, 3500);
            } else {
                setProductNotLoaded(true);
                setTimeout(() => {
                    setProductNotLoaded(false);
                }, 3500);
            }
        } catch (error: any) {
            setProductIsLoad(false);
        } finally {
            setProductIsLoad(false);
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
            ></TextField>

            <TextField
                variant="standard"
                type="text"
                label="название"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            ></TextField>

            <TextField
                variant="standard"
                type="text"
                label="описание"
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            ></TextField>

            <TextField
                variant="standard"
                type="number"
                label="цена"
                onChange={(e) => {
                    changePrice(e.target.value);
                }}
            ></TextField>

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
