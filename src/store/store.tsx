import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/auth.slice"
import authTypeModalReducer from "./slices/authTypeModal.slice"
import openModalSLiceReducer from "./slices/openModal.slice"
import buyerOrSellerSliceReducer from "./slices/buyerOrSeller.slice"
import searchSliceReducer from "./slices/search.slice"

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        authType: authTypeModalReducer,
        openModal: openModalSLiceReducer,
        buyerOrSeller: buyerOrSellerSliceReducer,
        search: searchSliceReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch