import { Button, TextField } from "@mui/material"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { hideSearch, noHideSearch } from "../../../../store/slices/homePage/search.slice"
import { useDispatch } from "react-redux"


function Search () {
    
    const dispatch = useDispatch()
    const isSeacrh = useAppSelector(state => state.search)

    const searchStyle = {
        display: isSeacrh ? "none" : "block"
    }
    const inputStyle = {
        display: isSeacrh ? "block" : "none"
    }

    const openSearch = () => {
        if(isSeacrh === false) {
            dispatch(noHideSearch())
        } if (isSeacrh === true) {
            dispatch(hideSearch())
        }
    }


    return (
        <div>
            <div style={inputStyle}>

                <TextField size="small" type="text" label="поиск" variant="standard"></TextField>
            <Button onClick={openSearch} variant="outlined" size="small">x</Button>
            </div>

            <Button style={searchStyle} onClick={openSearch} variant="outlined" size="small">поиск</Button>
        </div>
    )
}

export default Search