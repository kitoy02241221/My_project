import { useDispatch } from "react-redux"
import { useAppSelector } from "../../hooks/useAppSelector"
import {openModal} from "../../store/slices/openModal.slice"
import { removeAuth,} from "../../store/slices/auth.slice"
import Search from "../features/search/search"


function NavBar() {

    const dispatch = useDispatch()

    const isAuth = useAppSelector(state => state.auth)

    const auth = () => {
        if(isAuth === false) {
            dispatch(openModal())
        } if(isAuth === true) {
            dispatch(removeAuth())
        }
    }


    return (
        <div>
            <Search></Search>
            <button>главная</button>
            <button>корзина</button>
            <button>профиль</button>
            <button onClick={auth}>
                {isAuth
                ? "выйти"
                : "войти"}
                </button>
        </div>
    )
}

export default NavBar