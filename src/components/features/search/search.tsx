import { useAppSelector } from "../../../hooks/useAppSelector"
import { hideSearch, noHideSearch } from "../../../store/slices/search.slice"
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
            <input
            placeholder="поиск"
            type="text"></input>
            <button onClick={openSearch}>x</button>
            </div>

            <button style={searchStyle} onClick={openSearch}>поиск</button>
        </div>
    )
}

export default Search