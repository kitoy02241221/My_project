import { Button, TextField } from "@mui/material";
import { searching } from "../../../../store/slices/search/search.slice";
import { useDispatch } from "react-redux";
import { useSearch } from "../../../../hooks/useSearch";
import { useRef } from "react";

type modalProp = {
    isSearch: boolean;
    onClose: () => void;
};

function Search({ isSearch, onClose }: modalProp) {
    const dispatch = useDispatch();
    const { search } = useSearch();
    const timeoutRef = useRef(0);

    const inputStyle = {
        display: isSearch ? "block" : "none",
    };

    const changeSearch = (e: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            search(e);
            dispatch(searching(true));
        }, 500) as unknown as number;
    };

    return (
        <div>
            <div style={inputStyle}>
                <TextField
                    size="small"
                    type="text"
                    label="поиск"
                    variant="standard"
                    onChange={(e) => changeSearch(e.target.value)}
                />
                <Button onClick={onClose} variant="outlined" size="small">
                    x
                </Button>
            </div>
        </div>
    );
}

export default Search;
