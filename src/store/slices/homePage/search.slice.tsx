import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: false,
    reducers: {
        hideSearch: () => {
            return false;
        },
        noHideSearch: () => {
            return true;
        },
    },
});

export const { hideSearch, noHideSearch } = searchSlice.actions;
export default searchSlice.reducer;
