import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: false,
    reducers: {
        setAuth: (state) => {
            return true;
        },
        removeAuth: (state) => {
            return false;
        },
    },
});

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
