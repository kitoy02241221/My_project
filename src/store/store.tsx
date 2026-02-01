import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/homePage/auth.slice";
import authTypeModalReducer from "./slices/homePage/authTypeModal.slice";
import openModalSLiceReducer from "./slices/homePage/openModal.slice";
import buyerOrSellerSliceReducer from "./slices/homePage/buyerOrSeller.slice";
import searchSliceReducer from "./slices/homePage/search.slice";
import openSellModalReducer from "./slices/profilePage/openSellModal";

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        authType: authTypeModalReducer,
        openModal: openModalSLiceReducer,
        buyerOrSeller: buyerOrSellerSliceReducer,
        search: searchSliceReducer,
        openSellModal: openSellModalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
