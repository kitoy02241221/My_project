import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/homePage/auth.slice";
import buyerOrSellerSliceReducer from "./slices/homePage/buyerOrSeller.slice";
import searchSliceReducer from "./slices/search/search.slice";

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        buyerOrSeller: buyerOrSellerSliceReducer,
        search: searchSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
