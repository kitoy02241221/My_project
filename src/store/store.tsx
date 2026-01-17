import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/auth.slice"
import authTypeModalReducer from "./slices/authTypeModal.slice"
import openModalSLiceReducer, { openModal } from "./slices/openModal.slice"

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        authType: authTypeModalReducer,
        openModal: openModalSLiceReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch