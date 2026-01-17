import { useAppSelector } from "../../../hook/useAppSelector";
import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/authTypeModal.slice";
import { useState } from "react";
import { useRegister } from "../../../hooks/useRegister";
import { removeAuth, setAuth } from "../../../store/slices/auth.slice";


function AuthModal() {

    const [loginUser, setLoginUser] = useState("")
    const [passwordUser, setPassworUser] = useState("")
    const {
        register
    } = useRegister()


    const dispatch = useDispatch()

    const isOpen = useAppSelector(state => state.openModal)
    const data = useAppSelector(state => state.authType)
    const authType = useAppSelector(state => state.authType)
    
    const formStyle = {
        display: isOpen ? "block" : "none"
    }


    const toggleMode = (e: React.MouseEvent) => {
        if(e) e.preventDefault()
        dispatch(login())
    }


    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(authType === false) {
            await register(loginUser, passwordUser)
        } if(authType === true) {
            await register(loginUser, passwordUser)
        }
    }

    return (
        <form style={formStyle} onSubmit={(e) => submit(e)}>
            <input type="text" placeholder="логин" onChange={(e) => setLoginUser(e.target.value)}></input>
            <input type="password" placeholder="пароль" onChange={(e) => setPassworUser(e.target.value)}></input>
            <button type="submit">
                {data
                ? "зарегестрироваться"
                : "войти"}
                </button>
            <button onClick={(e) => toggleMode(e)}>
                {data
                ? "уже есть аккаунт? войти"
                : "нет аккаунта? зарегестрироваться"}
                </button>
        </form>
    )
}


export default AuthModal