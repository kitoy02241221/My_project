import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./useAppSelector";
import api from "../api/axiosBase";
import Fuse from "fuse.js";
import {
    searching,
    searchLoading,
    setProductData,
    clearSearch,
} from "../store/slices/search/search.slice";

type product = {
    created_at: Date;
    description: string;
    id: number;
    image_url: string;
    name: string;
    price: number;
    updated_at: number;
    user_id: number;
};

export const useSearch = () => {
    const dispatch = useDispatch();
    const productData = useAppSelector((state) => state.search.productData);
    const [allProducts, setAllProducts] = useState<product[]>([]);
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await api.get("/api/products");
                setAllProducts(response.data.products);
            } catch (error) {
                setError("ошибка при загрузке товаров");
            }
        };
        fetchAllProducts();
    }, []);

    const search = useCallback(
        async (searchProductName: string) => {
            if (!searchProductName.trim()) {
                dispatch(clearSearch());
                return;
            }

            dispatch(searchLoading(true));

            try {
                const products = allProducts;

                if (products.length === 0) {
                    return;
                }

                const fuse = new Fuse(products, {
                    keys: ["name", "description"],
                    threshold: 0.3,
                });

                const result = fuse.search(searchProductName);
                const searchProducts = result.map((r) => r.item);
                dispatch(setProductData(searchProducts));
                dispatch(searching(true));
                dispatch(searchLoading(false));
                setCount((prev) => prev + 1);
            } catch (error) {
                setError("ошибка при поиске товара");
                dispatch(searchLoading(false));
            }
        },
        [allProducts, dispatch],
    );

    return {
        search,
        productData,
        error,
        count,
    };
};
