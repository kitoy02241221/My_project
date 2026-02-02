import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { login } from "../../../../store/slices/homePage/authTypeModal.slice";
import { useState } from "react";
import { useRegister } from "../../../../hooks/useRegister";
import { closeModal } from "../../../../store/slices/homePage/openModal.slice";
import { noHide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import { Button, TextField } from "@mui/material";

function AuthModal() {
    const [loginUser, setLoginUser] = useState("");
    const [passwordUser, setPassworUser] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const { register } = useRegister();

    const dispatch = useDispatch();

    const data = useAppSelector((state) => state.authType);
    const authType = useAppSelector((state) => state.authType);
    const isOpen = useAppSelector((state) => state.openModal);

    const formStyle = {
        display: isOpen ? "block" : "none",
    };

    const toggleMode = () => {
        dispatch(login());
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (authType === false) {
            await register(loginUser, passwordUser, name, surname);
            // login
        } else {
            await register(loginUser, passwordUser, name, surname);
            // registration
        }

        dispatch(noHide());
        dispatch(closeModal());
    };

    return (
        <form style={formStyle} onSubmit={(e) => submit(e)}>
            <TextField
                label="логин"
                variant="standard"
                onChange={(e) => setLoginUser(e.target.value)}
                type="text"
            ></TextField>

            <TextField
                label="пароль"
                variant="standard"
                onChange={(e) => setPassworUser(e.target.value)}
                type="password"
            ></TextField>

            {authType && (
                <div>
                    <TextField
                        label="имя"
                        variant="standard"
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                    ></TextField>

                    <TextField
                        label="фимилия"
                        variant="standard"
                        onChange={(e) => setSurname(e.target.value)}
                        type="text"
                    ></TextField>
                </div>
            )}

            <Button type="submit" variant="outlined" size="small">
                {data ? "зарегестрироваться" : "войти"}
            </Button>

            <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={toggleMode}
            >
                {data
                    ? "уже есть аккаунт? войти"
                    : "нет аккаунта? зарегестрироваться"}
            </Button>
        </form>
    );
}

export default AuthModal;
