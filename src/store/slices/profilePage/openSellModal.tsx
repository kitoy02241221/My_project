import { createSlice } from "@reduxjs/toolkit";

const openSellModal = createSlice({
    name: "sellModal",
    initialState: false,
    reducers: {
        open: () => {
            return true;
        },
        close: () => {
            return false;
        },
    },
});

export const { open, close } = openSellModal.actions;
export default openSellModal.reducer;
