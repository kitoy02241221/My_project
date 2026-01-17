import { useDispatch, useSelector } from "react-redux"
import { useAppSelector } from "../../hook/useAppSelector"
import {openModal} from "../../store/slices/openModal.slice"
import { removeAuth,} from "../../store/slices/auth.slice"

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