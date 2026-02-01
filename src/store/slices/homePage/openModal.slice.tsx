import { createSlice } from "@reduxjs/toolkit";

const openModalSLice = createSlice({
    name: "openModal",
    initialState: false,
    reducers: {
        openModal: (state) => {
            return true;
        },
        closeModal: (state) => {
            return false;
        },
    },
});

export const { openModal, closeModal } = openModalSLice.actions;
export default openModalSLice.reducer;
