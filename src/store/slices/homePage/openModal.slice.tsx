import { createSlice } from "@reduxjs/toolkit";

const openModalSLice = createSlice({
    name: "openModal",
    initialState: false,
    reducers: {
        openModal: () => {
            return true;
        },
        closeModal: () => {
            return false;
        },
    },
});

export const { openModal, closeModal } = openModalSLice.actions;
export default openModalSLice.reducer;
