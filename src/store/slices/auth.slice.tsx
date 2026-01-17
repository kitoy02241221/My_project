import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice ({
    name: "authSlice",
    initialState: false,
    reducers: {
        setAuth: (state) => {
            return !state
        },
        removeAuth: (state) => {
            return !state
        }
    }
})

export const {setAuth, removeAuth} = authSlice.actions
export default authSlice.reducer