import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: false,
    reducers: {
        setAuth: () => {
            return true;
        },
        removeAuth: () => {
            return false;
        },
    },
});

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
