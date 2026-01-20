import { createSlice } from "@reduxjs/toolkit";


const buyerOrSellerSlice = createSlice({
    name: "buyerOrSeller",
    initialState: false,
    reducers: {
        noHide: (state) => {
            return !state
        },
        hide: (state) => {
            return false
        }
    }
})

export const {noHide, hide} = buyerOrSellerSlice.actions
export default buyerOrSellerSlice.reducer