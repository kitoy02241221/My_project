import { useState } from "react";

export const UseCropImg = () => {
    const [imageBase64, setImageBase64] = useState("");
    const [imgError, setImgError] = useState("");
    const [processing, setProcessing] = useState(false);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const isSquareImage = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const isSquare = Math.abs(img.width - img.height) <= 10;
                URL.revokeObjectURL(url);
                resolve(isSquare);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(false);
            };
            img.src = url;
        });
    };

    const cropToSquare = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const size = Math.min(img.width, img.height);

                canvas.width = size;
                canvas.height = size;

                const sx = (img.width - size) / 2;
                const sy = (img.height - size) / 2;

                ctx?.drawImage(img, sx, sy, size, size, 0, 0, size, size);

                const base64 = canvas.toDataURL("image/jpeg", 0.9);
                URL.revokeObjectURL(url);
                resolve(base64);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Ошибка загрузки изображения"));
            };

            img.src = url;
        });
    };

    const changeInputImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }
        const file = e.target.files[0];

        setImgError("");
        setProcessing(true);
        setImageBase64("");
        if (!file.type.startsWith("image/")) {
            setImgError("Выберите файл изображения");
            setProcessing(false);
            return;
        }
        try {
            const square = await isSquareImage(file);
            let base64: string;
            if (square) {
                base64 = await convertFileToBase64(file);
            } else {
                const shouldCrop = window.confirm(
                    "Можно загружать только квадратные изображения. Обрезать автоматически?",
                );
                if (shouldCrop) {
                    base64 = await cropToSquare(file);
                } else {
                    setImgError("Выберите квадратное изображение");
                    setProcessing(false);
                    return;
                }
            }
            setImageBase64(base64);
        } catch (error) {
            setImgError("Ошибка обработки изображения");
        } finally {
            setProcessing(false);
        }
    };

    return {
        changeInputImg,
        imageBase64,
        imgError,
        setImageBase64,
        processing,
    };
};
