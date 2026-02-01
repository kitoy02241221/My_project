import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: false,
    reducers: {
        hideSearch: (state) => {
            return false;
        },
        noHideSearch: (state) => {
            return true;
        },
    },
});

export const { hideSearch, noHideSearch } = searchSlice.actions;
export default searchSlice.reducer;
