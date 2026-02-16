import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRegister } from "../../../../hooks/useRegister";
import { closeModal } from "../../../../store/slices/homePage/openModal.slice";
import { noHide } from "../../../../store/slices/homePage/buyerOrSeller.slice";
import { Button, TextField } from "@mui/material";
import { Registartion } from "./authInterface/registerInteface";

type openModal = {
    isOpen: boolean;
    onClose: () => void;
};

function AuthModal({ isOpen, onClose }: openModal) {
    if (!isOpen) return null;
    const [registerData, setRegisterData] = useState<Registartion>({
        login: "",
        password: "",
        name: "",
        surname: "",
    });

    const [authType, setAuthType] = useState(Boolean);

    const dispatch = useDispatch();
    const { register } = useRegister();

    const formStyle = {
        display: isOpen ? "block" : "none",
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authType === false) {
            await register(registerData, authType);
            onClose();
            // login
        } else {
            await register(registerData, authType);
            onClose();
            // registration
        }
        dispatch(noHide());
        dispatch(closeModal());
    };

    const switchAuthMode = () => {
        setAuthType((prev) => !prev);
    };

    return (
        <form style={formStyle} onSubmit={(e) => submit(e)}>
            <TextField
                label="логин"
                variant="standard"
                required={true}
                onChange={(e) => setRegisterData({ ...registerData, login: e.target.value })}
                type="text"
            />

            <TextField
                label="пароль"
                variant="standard"
                required={true}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                type="password"
            />

            {authType && (
                <div>
                    <TextField
                        label="имя"
                        variant="standard"
                        required={true}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        type="text"
                    />

                    <TextField
                        label="фимилия"
                        variant="standard"
                        required={true}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, surname: e.target.value })
                        }
                        type="text"
                    />
                </div>
            )}

            <Button type="submit" variant="outlined" size="small">
                {authType ? "зарегестрироваться" : "войти"}
            </Button>

            <Button type="button" variant="outlined" size="small" onClick={switchAuthMode}>
                {authType ? "уже есть аккаунт? войти" : "нет аккаунта? зарегестрироваться"}
            </Button>
        </form>
    );
}

export default AuthModal;
