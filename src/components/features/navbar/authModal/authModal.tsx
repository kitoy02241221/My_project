import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { login } from "../../../../store/slices/homePage/authTypeModal.slice";
import { useState } from "react";
import { useRegister } from "../../../../hooks/useRegister";
import { closeModal } from "../../../../store/slices/homePage/openModal.slice";
import { noHide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import { Button, TextField } from "@mui/material";
import { Registartion } from "./authInterface/registerInteface";

function AuthModal() {
    const [registerData, setRegisterData] = useState<Registartion>({
        login: "",
        password: "",
        name: "",
        surname: "",
    });

    const dispatch = useDispatch();
    const { register } = useRegister();

    const data = useAppSelector((state) => state.authType);
    const authType = useAppSelector((state) => state.authType);
    const isOpen = useAppSelector((state) => state.openModal);

    const formStyle = {
        display: isOpen ? "block" : "none",
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authType === false) {
            await register(registerData);
            // login
        } else {
            await register(registerData);
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
                onChange={(e) => setRegisterData({ ...registerData, login: e.target.value })}
                type="text"
            />

            <TextField
                label="пароль"
                variant="standard"
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                type="password"
            />

            {authType && (
                <div>
                    <TextField
                        label="имя"
                        variant="standard"
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        type="text"
                    />

                    <TextField
                        label="фимилия"
                        variant="standard"
                        onChange={(e) =>
                            setRegisterData({ ...registerData, surname: e.target.value })
                        }
                        type="text"
                    />
                </div>
            )}

            <Button type="submit" variant="outlined" size="small">
                {data ? "зарегестрироваться" : "войти"}
            </Button>

            <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={() => {
                    dispatch(login());
                }}
            >
                {data ? "уже есть аккаунт? войти" : "нет аккаунта? зарегестрироваться"}
            </Button>
        </form>
    );
}

export default AuthModal;
