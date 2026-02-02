import Search from "../features/navbar/search/search";
import AuthModal from "../features/navbar/authModal/authModal";

import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";

import { openModal } from "../../store/slices/homePage/openModal.slice";
import { removeAuth } from "../../store/slices/homePage/auth.slice";

import { Button } from "@mui/material";

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuth = useAppSelector((state) => state.auth);

    const navToProfile = () => {
        if (isAuth === true) {
            navigate("/profile");
        } else {
            navigate("/");
        }
    };

    const navToCart = () => {
        if (isAuth === true) {
            navigate("/cart");
        } else {
            navigate("/");
        }
    };

    const auth = () => {
        if (isAuth === false) {
            dispatch(openModal());
        } else {
            dispatch(removeAuth());
        }
    };

    return (
        <div>
            <Search></Search>
            <Button variant="outlined" size="small">
                главная
            </Button>
            <Button variant="outlined" size="small" onClick={navToCart}>
                корзина
            </Button>
            <Button variant="outlined" size="small" onClick={navToProfile}>
                профиль
            </Button>
            <Button variant="outlined" size="small" onClick={auth}>
                {isAuth ? "выйти" : "войти"}
            </Button>
            <AuthModal />
        </div>
    );
}

export default NavBar;
