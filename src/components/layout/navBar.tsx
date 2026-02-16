import Search from "../features/navbar/search/search";
import AuthModal from "../features/navbar/authModal/authModal";

import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/useAppSelector";
import { removeAuth } from "../../store/slices/homePage/auth.slice";
import { clearSearch } from "../../store/slices/search/search.slice";

const linkStyle = {
    textDecoration: "none",
    color: "inherit",
};

export function NavBar() {
    const dispatch = useDispatch();

    const isAuth = useAppSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const searchStyle = {
        display: isSearch ? "none" : "block",
    };

    const auth = () => {
        if (isAuth === false) {
            setIsOpen((prev) => !prev);
        } else {
            dispatch(removeAuth());
        }
    };

    const onClose = () => {
        setIsSearch(false);
        dispatch(clearSearch());
    };

    return (
        <div>
            <Search isSearch={isSearch} onClose={onClose} />
            <Button
                style={searchStyle}
                onClick={() => setIsSearch(true)}
                variant="outlined"
                size="small"
            >
                поиск
            </Button>
            <Button variant="outlined" size="small">
                <Link to="/" style={linkStyle}>
                    главная
                </Link>
            </Button>
            <Button variant="outlined" size="small" disabled={isAuth ? false : true}>
                <Link to="/cart" style={linkStyle}>
                    корзина
                </Link>
            </Button>
            <Button variant="outlined" size="small" disabled={isAuth ? false : true}>
                <Link to="/profile" style={linkStyle}>
                    профиль
                </Link>
            </Button>
            <Button variant="outlined" size="small" onClick={auth}>
                {isAuth ? "выйти" : "войти"}
            </Button>
            <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
