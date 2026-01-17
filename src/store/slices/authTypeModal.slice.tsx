import { createSlice } from "@reduxjs/toolkit"

const authTypeModal = createSlice({
    name: "authType",
    initialState: false,
    reducers: {
        login: (state) => {
            return !state
        }
    }
})


export const { login} = authTypeModal.actions
export default authTypeModal.reducer