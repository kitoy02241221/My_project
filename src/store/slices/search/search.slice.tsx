import { createSlice } from "@reduxjs/toolkit";

type Product = {
    created_at: Date;
    description: string;
    id: number;
    image_url: string;
    name: string;
    price: number;
    updated_at: number;
    user_id: number;
};

const inState = {
    isSearch: false,
    searchLoading: false,
    isOpenSearch: false,
    productData: [] as Product[],
};

const searchSlice = createSlice({
    name: "search",
    initialState: inState,
    reducers: {
        searching: (state, action) => {
            state.isSearch = action.payload;
        },
        searchLoading: (state, action) => {
            state.searchLoading = action.payload;
        },
        setProductData: (state, action) => {
            state.productData = action.payload;
        },
        hideSearch: (state) => {
            state.isOpenSearch = false;
        },
        noHideSearch: (state) => {
            state.isOpenSearch = true;
        },
        clearSearch: (state) => {
            state.isSearch = false;
            state.productData = [];
            state.searchLoading = false;
        },
    },
});

export const { searching, searchLoading, setProductData, hideSearch, noHideSearch, clearSearch } =
    searchSlice.actions;
export default searchSlice.reducer;
